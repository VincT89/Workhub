import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import CalendarBox from "../components/CalendarBox";
import {
	WarehouseIcon,
	ShoppingCartSimpleIcon,
	UserCircleCheckIcon,
	ChalkboardSimpleIcon,
	PackageIcon,
	WarningOctagonIcon,
	CalendarIcon,
	NotePencilIcon,
	TrashIcon
} from "@phosphor-icons/react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
	fetchEventsAsync,
	createEventAsync,
	updateEventAsync,
	deleteEventAsync,
} from "../store/feature/eventsSlice.js";
import { fetchProducts } from "../store/feature/productsSlice.js";
import Table from "../components/Table";
import Drawer from "../components/Drawer";

const BoardPage = () => {
	const { theme } = useTheme();
	const { t } = useLanguage();
	const { role } = useSelector((state) => state.auth.user);
	const token = useSelector((state) => state.auth.token);
	const users = useSelector((state) => state.users); // per richiamare i dati del personale (nelle box in alto)
	const pointOfSales = useSelector((state) => state.pos); // per richiamare i dati dei depositi (nelle box in alto)
	const products = useSelector((state) => state.products); // per richiamare i dati dei prodotti (nelle box in alto)
	

	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";


	const dispatch = useDispatch();

	const events = useSelector((state) => state.events.events); // tutti gli eventi

	useEffect(() => {
		if (token) {
			dispatch(fetchEventsAsync({ token })); // carica tutti gli eventi
			dispatch(fetchProducts( token )); // carica tutti i prodotti
		}
	}, [dispatch, token]);

	const boardPosts = events.map((event) => ({ // dati per la tabella bacheca
		_id: event._id,
		title: event.title,
		date: event.startDate ? event.startDate.slice(0, 10) : "",
		description: event.description || "",
	}));

	const boardColumns = ["title", "date", "description"]; // colonne tabella bacheca

	const columnLabels = {
		title: t("dashboard.titolo"),
		date: t("dashboard.data"),
		description: t("dashboard.descrizione"),
	};

	// State per il Drawer 
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [editData, setEditData] = useState(null);

	// Apre drawer in modalità modifica
	const openDrawerEdit = (row) => {
		setEditData({
			_id: row._id,
			title: row.title,
			date: row.date,
			description: row.description || "",
		});
		setDrawerOpen(true);
	};

	// Apre drawer per aggiungere
	const openDrawerAdd = () => {
		setEditData({ _id: null, title: "", date: "", description: "" });
		setDrawerOpen(true);
	};

	// Salva (sia nuovo che modifica)
	const handleSavePost = (e) => {
		e.preventDefault();

		const payload = {
			title: editData.title,
			startDate: editData.date,
			endDate: editData.date,
			description: editData.description,
		};

		if (editData._id) {
			dispatch(updateEventAsync({ id: editData._id, data: payload, token }));
		} else {
			dispatch(createEventAsync({ data: payload, token }));
		}

		setDrawerOpen(false);
		setEditData(null);
	};

	const handleDelete = (row) => { // elimina evento
		if (
			window.confirm(` ${t("dashboard.seiSicuroEliminareEvento")}"${row.title}"?`)
		) {
			dispatch(deleteEventAsync({ id: row._id, token }));
		}
	};

	return (
		<div
			className="w-full h-full flex flex-col gap-8 overflow-y-auto 
			[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
		>
			{/* Riga 1: i 5 box - con un div che li contiene tutti, e a seguire i singoli box-div */}
			<div className="grid grid-cols-5 gap-4 mb-2 w-full transition-colors duration-500">
				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<WarehouseIcon size={28} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
						<span className="font-bold text-[14px]">{t("dashboard.depositi")}</span>
					</div>
					<span className={`text-sm opacity-70 leading-none font-semibold ${theme === "dark" ? "text-white" : "text-[#090c64]"}`}>
						{pointOfSales?.list?.length ?? 0}
					</span>
				</div>

				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<ShoppingCartSimpleIcon size={28} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
						<span className="font-bold text-[14px]">{t("dashboard.prodotti")}</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						{products?.list?.length ?? 0}
					</span>
				</div>

				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<PackageIcon size={28} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
						<span className="font-bold text-[14px]">{t("dashboard.ordiniInUscita")}</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						20
					</span>
				</div>

				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<WarningOctagonIcon size={28} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
						<span className="font-bold text-[14px]">{t("dashboard.articoliSottoSoglia")}</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						10
					</span>
				</div>

				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<UserCircleCheckIcon size={28} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />
						<span className="font-bold text-[14px] ">{t("dashboard.personaleAttivo")}</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						{users?.list?.length ?? 0}
					</span>
				</div>
			</div>

			{/* Riga 2: 2 box - con un div che li contiene tutti, e a seguire i singoli box-div  */}
			<div className="grid grid-cols-2 gap-6 mb-6 w-full transition-colors duration-500">
				<div
					className={`flex flex-col gap-4 p-4 
  bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
  border border-white/30 dark:border-white/80 rounded-xl shadow-md 
  ${textColor}`}
				>
					{/* HEADER BACHECA */}
					<div className="flex items-start gap-4 w-full">
						<ChalkboardSimpleIcon size={28} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />

						<h3 className="text-[14px] font-bold font-nunito">{t("dashboard.bacheca")}</h3>

						{(role === "supervisor" || role === "admin") && (
							<button
								onClick={openDrawerAdd}

								className="ml-auto px-4 py-2 bg-white dark:bg-[#090c64] text-[#090c64] dark:text-white shadow-md border border-white/20 transition-all duration-500 rounded-xl text-[15px] font-bold cursor-pointer"
							>
								+ {t("dashboard.aggiungi")}
							</button>
						)}
					</div>

					{/* TABELLA */}
					<div className="w-full h-full overflow-hidden">
						<Table
							data={boardPosts}
							columns={boardColumns}
							columnLabels={columnLabels}
							actionLabel={"Actions"}
							actions={
								role === "admin"
									? [
										{
											name: "edit",
											icon: (
												<NotePencilIcon
													size={28}
													color={theme === "dark" ? "white" : "#090c64"}
													weight="duotone"
													className="mr-4"
												/>
											),
											onClick: openDrawerEdit,
										},
										{
											name: "delete",
											icon: (
												<TrashIcon size={28} color={theme === "dark" ? "#ff4d4d" : "#ff0000"} weight="duotone" />
											),
											onClick: handleDelete,
										},
									]
									: []
							}
						/>
					</div>
				</div>

				<div
					className={`flex flex-col gap-4 p-4 
  bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
  border border-white/30 dark:border-white/80 rounded-xl shadow-md 
  ${textColor}`}
				>
					{/* HEADER */}
					<div className="flex items-center gap-4">
						<ShoppingCartSimpleIcon size={28} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />

						<h3 className="text-[14px] font-bold font-nunito">
							{t("dashboard.prodottiInEsaurimento")}
						</h3>
					</div>

					{/* TABELLA */}
					<div className="w-full overflow-hidden h-full mt-3">
						<Table
							data={[
								{ name: "Prodotto A", stock: "8" },
								{ name: "Prodotto B", stock: "5" },
								{ name: "Prodotto C", stock: "2" },
							]}
							columns={["name", "stock"]}
							columnLabels={{
								name: t("dashboard.prodotto"),
								stock: t("dashboard.giacenza"),
							}}
						/>
					</div>
				</div>
			</div>

			{/* Riga 3: 1 box - Calendario */}
			<div
				className="bg-[#fafafa20] dark:bg-[#fafafa20] backdrop-blur-sm border border-white/30 dark:border-white/80
  rounded-xl p-6 shadow-md flex items-start gap-4 mb-2 min-h-[700px]"
			>
				{/* Contenuto */}
				<div className="flex-1 flex flex-col">
					<div className="flex gap-4 justify-start items-start">
						<CalendarIcon size={28} color={theme === "dark" ? "white" : "#090c64"}  weight="duotone" />
						<h3
							className={`text-[14px] font-bold font-nunito ${textColor} mb-4`}
						>
							{t("dashboard.calendario")}
						</h3>
					</div>

					<CalendarBox />
				</div>
			</div>

			<Drawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				title={editData && editData.title ? t("dashboard.modificaEvento") : t("dashboard.aggiungiEvento")}
			>
				{editData && (
					<form onSubmit={handleSavePost} className="flex flex-col gap-4">
						<div className="flex flex-col">
							<label className="text-sm font-bold">{t("dashboard.titolo")}</label>
							<input
								type="text"
								value={editData.title}
								placeholder={t("dashboard.aggiungiEvento")}
								onChange={(e) =>
									setEditData({ ...editData, title: e.target.value })
								}
								className="px-3 py-2 rounded-xl bg-[#fafafa20] border border-white/30"
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-bold">{t("dashboard.data")}</label>
							<input
								type="date"
								value={editData.date}
								placeholder="dd/mm/yyyy"
								onChange={(e) =>
									setEditData({ ...editData, date: e.target.value })
								}
								className="px-3 py-2 rounded-xl bg-[#fafafa20] border border-white/30"
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-bold">{t("dashboard.descrizione")}</label>
							<input
								type="text"
								value={editData.description}
								placeholder={t("dashboard.inserisciDescrizioneEvento")}
								onChange={(e) =>
									setEditData({ ...editData, description: e.target.value })
								}
								className="px-3 py-2 rounded-xl bg-[#fafafa20] border border-white/30"
							/>
						</div>

						<div className="flex justify-end gap-3 mt-4">
							<button
								type="button"
								onClick={() => setDrawerOpen(false)}
								className="custom-button-light"
							>
								{t("dashboard.annulla")}
							</button>

							<button type="submit" className="custom-button">
								{t("dashboard.salva")}
							</button>
						</div>
					</form>
				)}
			</Drawer>
		</div>
	);
};

export default BoardPage;
