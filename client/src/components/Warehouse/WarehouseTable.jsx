import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useNavigate } from "react-router-dom";
import DrawerSede from "../Warehouse/DrawerSede.jsx";

import { useSelector, useDispatch } from "react-redux";
import {
	setSelectedCategory,
	setSearchTerm,
	toggleSortAZ,
	toggleLowStockFilter,
} from "../../store/feature/warehouseFiltersSlice";

const WarehouseTable = ({ data, allItems, columns }) => {
	const navigate = useNavigate();
	const { t } = useLanguage();

	//? ---------- STATE ----------

	// Stato dei filtri → Redux
	const selectedCategory = useSelector(
		(state) => state.warehouseFilters.selectedCategory
	);
	const searchTerm = useSelector((state) => state.warehouseFilters.searchTerm);
	const sortAZ = useSelector((state) => state.warehouseFilters.sortAZ);
	const lowStockFilter = useSelector(
		(state) => state.warehouseFilters.lowStockFilter
	);
	const userWorkplaceId = useSelector(
		(state) => state.auth.user?.workplace?._id
	); // punto vendita associato all'utente

	// Stato locale → rimane useState
	const [drawerOpen, setDrawerOpen] = useState(false);

	// normalizzare nomi thread tabella
	const columnLabels = {
		sku: "SKU",
		product: t("prodotto"),
		category: t("categoria"),
		pointOfSales: t("puntoVendita"),
		stock: t("disponibilita"),
		stockLimit: t("limiteRiordino"),
		promo: t("promo"),
		note: t("note"),
		stato: t("stato"),
	};

	// Dispatcher Redux
	const dispatch = useDispatch();

	//? ---------- MEMO: categorie ---------
	const categories = useMemo(() => {
		const names = allItems
			.map((p) => p.product?.category?.name)
			.filter(Boolean); // rimuove null/undefined/vuoti
		return [t("tutteCategorie"), ...new Set(names)];
	}, [allItems, t]);

	// prendo mappa categorie per filtro usando useMemo per non ricalcolarla ad ogni render 
	const categoryMap = useMemo(() => {
		const map = new Map();

		allItems.forEach((item) => {
			const cat = item.product?.category;
			if (cat?.name && cat?._id) {
				map.set(cat.name, cat._id);
			}
		});

		return map;
	}, [allItems]);

	//? ---------- DATA PROCESSING ----------
	const filteredData = useMemo(() => {
		let result = [...data]; // spread syntax: copia l'array "data" per applicare
		// filtri senza modificare l'originale

		// Filtro per nome prodotto
		if (searchTerm) {
			// controlliamo che non sia vuoto searchTerm
			const q = searchTerm.toLowerCase(); // q = abbreviazione convenz. di query
			result = result.filter(
				(
					p // p= ogni prodotto dell'array result
				) =>
					// converte in stringa per non avere errori con p.id che è un numero
					// Se l’utente scrive “12”, e l’ID è 5129, il prodotto esce cmq col filtro
					String(p.product?.name || "")
						.toLowerCase()
						.includes(q) || // se il nome include la query
					String(p._id).toLowerCase().includes(q) // se l'id include la query
			);
		}

		// Filtro per categoria
		if (selectedCategory !== t("tutteCategorie")) {
			const selectedCategoryId = categoryMap.get(selectedCategory);

			if (selectedCategoryId) {
				result = result.filter(
					(p) => String(p.product?.category?._id) === String(selectedCategoryId)
				);
			}
		}

		// filtro articoli in esaurimento
		if (lowStockFilter) {
			// se il filtro è attivo (cioè se l'utente clicca il bottone del filtro) applicalo
			result = result.filter(
				//filter sostituisce "result" con un nuovo array (i prodotti filtrati)
				(p) => (p.stock?.["Mia Sede"] || p.stock || 0) < 15 // filtro: "p" rappresenta ogni prodotto dell'array
				/* => indica che la funzione restituisce quello che c’è dopo ( come scrivere: function(p) { return ...} 
         p.stock? --> accedo alla proprietà "stock" di ogNi p
         ?. --> (optional chaining) è l'operatre che evita errore se stock non esiste: “Se stock esiste, continua.
         Se non esiste, restituisci undefined invece di errore”.
         ["Mia Sede"] accesso alla proprietà "Mia Sede" tramite stringa
         Se il valore non esiste "|| 0" lo sostituisce con zero 
         <15 --> Se il valore è minore di 15 restituisce true, altrimenti restituisce false */
			);
		}

		// Ordinamento A-Z
		if (sortAZ) {
			result.sort((a, b) =>
				(a.product?.name || "").localeCompare(b.product?.name || "")
			);
		}

		return result;
	}, [data, searchTerm, selectedCategory, sortAZ, lowStockFilter]);

	return (
		<div className="w-full rounded-2xl bg-[#fafafa]/10 p-6 shadow-md border border-white flex flex-col gap-4">
			{/* ---------- TOOLBAR CON FILTRI ---------- */}
			<div className="flex flex-wrap items-center gap-3 mb-3">
				<h2 className="text-lg font-bold"> {t("magazzino")} </h2>

				{/* Ordinamento A-Z */}
				<button
					onClick={() => dispatch(toggleSortAZ())}
					className="custom-button text-[14px]"
				>
					{sortAZ ? t("ordinaZA") : t("ordinaAZ")}
				</button>

				{/* Filtro categoria */}
				<select
					value={selectedCategory}
					onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
					className="custom-button text-[14px] focus:outline-none focus:ring-0" //focus:outline-none focus:ring-0 PER TOGLIERE BORDO BLU DI DEFAULT DI SELECT
				>
					{categories.map((c) => (
						<option key={c} value={c}>
							{c}
						</option>
					))}
				</select>

				{/* Ricerca per nome o codice prodotto */}
				<input
					type="text"
					placeholder={t("cercaIdNomeProdotto")}
					value={searchTerm}
					onChange={(e) => dispatch(setSearchTerm(e.target.value))}
					className="px-3 py-1.5 rounded-lg shadow-md border border-white/20 text-sm w-64 focus:outline-none bg-white"
				/>

				{/* Articoli in esaurimento */}
				<button
					onClick={() => dispatch(toggleLowStockFilter())}
					className="custom-button text-[14px]"
				>
					{lowStockFilter ? t("mostraTutti") : t("articoliInEsaurimento")}
					{/* operatore ternario (ternary expression) --> condizione ? valore_se_vero : valore_se_falso 
          quindi se lowStockFilter è true "mostra tutti" se è false "articoli in esaurimento" */}
				</button>

				{/* Bottone Drawer. Disponibilità in altre sedi */}
				<button
					onClick={() => setDrawerOpen(true)}
					className="custom-button text-[14px]"
				>
					{t("disponibilitaAltreSedi")}
				</button>
			</div>

			{/* ---------- TABELLA CON DATI ---------- */}
			<table className="w-full border-collapse text-sm text-[#090c64]">
				<thead className="font-bold bg-white/30">
					<tr className="bg-white/60 rounded-xl text-center">
						{columns.map((c, i) => (
							<th
								key={i}
								className={`p-3 ${i === 0 ? "rounded-l-xl" : ""} ${
									i === columns.length - 1 ? "rounded-r-xl" : ""
								}`}
							>
								{columnLabels[c]}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{/*  ------- LOGICA PER POPOLARE LA TABELLA -------- */}
					{filteredData.map((row, i) => (
						<tr
							key={i}
							onClick={() => navigate(`/product/${row._id}`, { state: row })}
							className="cursor-pointer text-center"
						>
							{/* ETICHETTE COLORATE IN BASE ALLO STATO */}
							{columns.map((col, j) => {
								// cicla i nomi delle colonne nell'array columns

								// Colonna STATO
								if (col === "stato") {
									const stockVal = row.stock?.["Mia Sede"] || row.stock || 0;
									let border, bg, textColor, text;

									if (stockVal > 0) {
										text = "Disponibile";
										border = "border-green-300";
										bg = "bg-green-50";
										textColor = "text-green-700";
									} else if (row.outOfProduction) {
										text = "Fuori produzione";
										border = "border-gray-300";
										bg = "bg-gray-50";
										textColor = "text-gray-500";
									} else {
										text = "Non disponibile";
										border = "border-red-300";
										bg = "bg-red-50";
										textColor = "text-red-400";
									}

									return (
										<td
											key={j}
											className={`p-3 ${j === 0 ? "rounded-l-xl" : ""} ${
												j === columns.length - 1 ? "rounded-r-xl" : ""
											}`}
										>
											<span
												className={`${bg} ${border} ${textColor} border text-sm px-1.5 py-1 rounded-lg font-semibold`}
											>
												{text}
											</span>
										</td>
									);
								}

								// Colonna quantità
								if (col === "quantita") {
									const qty = row.stock?.["Mia Sede"] || row.stock || 0;
									return (
										<td
											key={j}
											className={`p-3 ${j === 0 ? "rounded-l-xl" : ""} ${
												j === columns.length - 1 ? "rounded-r-xl" : ""
											}`}
										>
											{qty}
										</td>
									);
								}

								// Colonne product, category, pointOfSales
								if (col === "sku")
									return (
										<td key={j} className="p-3">
											{row.product?.sku || ""}
										</td>
									);
								if (col === "product")
									return (
										<td key={j} className="p-3">
											{row.product?.name || ""}
										</td>
									);
								if (col === "category")
									return (
										<td key={j} className="p-3">
											{row.product?.category?.name || ""}
										</td>
									);
								if (col === "pointOfSales")
									return (
										<td key={j} className="p-3">
											{row.pointOfSales?.name || ""}
										</td>
									);
								// Se la colonna corrente è "promo", allora gestiamo la logica speciale per le promozioni
								if (col === "promo") {
									// Estraiamo l'oggetto promo dalla riga corrente
									const promo = row.promo;

									//? Se promo NON esiste (undefined/null) oppure se promo.value è null/undefined
									// significa che il prodotto NON ha una promozione attiva.
									if (!promo || promo.value == null) {
										// Mostriamo un trattino "—" per indicare "nessuna promo"
										return (
											<td key={j} className="p-3">
												—
											</td>
										);
									}

									//? Se promo ESISTE e ha un valore, allora mostriamo la promo formattata
									return (
										<td key={j} className="p-3">
											{
												// Se la promo è di tipo "percentage", es: 20 --> "20%"
												promo.mode === "percentage"
													? `${promo.value}%`
													: // Altrimenti è una promo in euro, es: 5 --> "5€"
													  `${promo.value}€`
											}
										</td>
									);
								}

								// Tutte le altre colonne
								return (
									<td
										key={j}
										className={`p-3 ${j === 0 ? "rounded-l-xl" : ""} ${
											j === columns.length - 1 ? "rounded-r-xl" : ""
										}`}
									>
										{String(row[col] || "")}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>

			{data.length > 0 && filteredData.length === 0 && (
				<p className="text-center text-gray-500 italic mt-2">
					Nessun risultato trovato.
				</p>
			)}

			{/* Drawer */}
			<DrawerSede
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				productData={allItems}
				userWorkplaceId={userWorkplaceId}
			/>
		</div>
	);
};

export default WarehouseTable;