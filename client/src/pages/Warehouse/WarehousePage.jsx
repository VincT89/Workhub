import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { fetchItems } from "../../store/feature/itemsSlice";
import { addItem } from "../../store/feature/itemsSlice";
import { useTheme } from "../../context/ThemeContext.jsx";

import WarehouseTable from "../../components/Warehouse/WarehouseTable";
import DrawerAddNewProduct from "../../components/Warehouse/DrawerAddNewProduct";
import { WarehouseIcon } from "@phosphor-icons/react";
import { PlusCircleIcon } from "@phosphor-icons/react";

const WarehousePage = () => {
	//? Prendo dispatcher e items dal Redux store
	const dispatch = useDispatch();
	const { t } = useLanguage();
	const items = useSelector((state) => state.items.list);
	const status = useSelector((state) => state.items.status);
	const userWorkplaceId = useSelector((state) => state.auth.user?.workplace?._id); // punti vendita associati all'utente
	const { theme } = useTheme();
	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

	//? Chiamo il server quando la pagina si apre
	useEffect(() => {
	if (userWorkplaceId) {
		dispatch(fetchItems(userWorkplaceId));
	}
}, [userWorkplaceId, dispatch]);

	// colonne dinamiche della tabella
	const columns = [
		"sku",
		"product",
		"category",
		"pointOfSales",
		"stock",
		"stockLimit",
		"promo",
		"note",
		"stato",
	];

	// Drawer per aggiungere prodotto
	const [drawerAddOpen, setDrawerAddOpen] = useState(false);

	// Box riassuntivi
	const summaryButtons = [
		{
			label: t("totArticoli"),
			number: items.length,
			icon: (
				<WarehouseIcon
					size={32}
					color={theme === "dark" ? "white" : "#090c64"}
					weight="duotone"
				/>
			),

			clickable: false,
		},
		{
			label: t("caricaGiacenza"),
			icon: (
				<PlusCircleIcon
					size={32}
					color={theme === "dark" ? "white" : "#090c64"}
					weight="duotone"
				/>
			),
			clickable: true,
			onClick: () => setDrawerAddOpen(true),
		},
	];
	//? Aggiunta prodotto al magazzino
	const handleAddProduct = (newProduct) => {
		dispatch(addItem(newProduct));
	};

	// funzione per filtrare i prodotti in base ai punti vendita dell'utente
	const filteredItems = useMemo(() => {
		// se user non è ancora pronto → mostra TUTTI gli items
		if (!userWorkplaceId) return items;

		return items.filter(
			(item) => String(item.pointOfSales?._id) === String(userWorkplaceId) // confronto come stringhe
		);
	}, [items, userWorkplaceId]);
	

	return (
		<div className="w-full min-h-screen flex justify-center items-start">
			<div className=" w-full flex flex-col gap-8">
				{/* BOX RIASSUNTIVI */}
				<div className="flex gap-4">
					{summaryButtons.map((btn, index) => (
						<button
							key={index}
							disabled={!btn.clickable}
							onClick={btn.onClick}
							className={`flex-1 rounded-xl px-4 py-3 border border-white shadow-sm transition text-[#090c64] flex items-center justify-center gap-2
                                ${
																	btn.clickable
																		? "bg-[#fafafa]/10 hover:bg-[#e8defc]/30 cursor-pointer"
																		: "bg-[#fafafa]/10 cursor-default"
																}`}
						>
							{btn.icon}
							<span className="inline-flex items-baseline gap-2">
								<span className={`font-bold ${textColor}`}>{btn.label}</span>
								{btn.number !== undefined && (
									<span
										className={`text-sm opacity-70 leading-none ${textColor}`}
									>
										{btn.number}
									</span>
								)}
							</span>
						</button>
					))}
				</div>

				{/* TABELLA */}
				<WarehouseTable data={filteredItems} columns={columns} />

				{/* DRAWER AGGIUNGI PRODOTTO */}
				<DrawerAddNewProduct
					open={drawerAddOpen}
					onClose={() => setDrawerAddOpen(false)}
					onAddStock={handleAddProduct}
				/>
			</div>
		</div>
	);
};

export default WarehousePage;
