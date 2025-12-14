// USEMEMO → PER MEMORIZZARE UN RISULTATO DI UN CALCOLO E NON FARLO TUTTE LE VOLTE
import React from "react";
import { useState, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";

// Formattatore €
const formatEuro = (value) => {
	if (value === null || value === undefined || isNaN(value)) return "-";
	return new Intl.NumberFormat("it-IT", {
		style: "currency",
		currency: "EUR",
	}).format(Number(value));
};

const OrdersTable = ({
	data,
	columns,
	columnsLabels = {},
	customToolbar,
	actions,
	actionLabel = null,
	onRowClick,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortAZ, setSortAZ] = useState(false);

	// apre finestra dettaglio
	const [openRowId, setOpenRowId] = useState(null);

	const { t } = useLanguage();

	// FILTRO + A-Z
	const filteredData = useMemo(() => {
		const query = searchTerm.toLowerCase();

		let result = data.filter((row) =>
			columns.some((col) => {
				const value = row[col];
				if (value === null || value === undefined) return false;
				return String(value).toLowerCase().includes(query);
			})
		);

		if (sortAZ && columns.length > 1) {
			const sortColumn = columns[1];
			result = [...result].sort((a, b) =>
				String(a[sortColumn] || "").localeCompare(String(b[sortColumn] || ""))
			);
		}

		return result;
	}, [searchTerm, data, columns, sortAZ]);

	// colonne da centrare
	const centeredCols = [
		"quantità totale",
		"data",
		"stato",
		"corriere",
		"totale",
	];

	return (
		<div className=" rounded-xl bg-white/20 backdrop-blur-xl p-6 shadow-md border border-white/90 flex flex-col gap-4">
			{/* TOOLBAR */}
			<div className="flex flex-col gap-3 mb-3">
				<div className="flex flex-wrap items-center gap-6">
					<div className="flex items-center gap-3">
						<h2 className="text-lg font-bold text-[#090c64]">{t("ordini")}</h2>

						{/* bottone A-Z → solo ordinamento locale, non modifica i dati */}
						<button
							onClick={() => setSortAZ(!sortAZ)}
							className="warehouse-btn font-bold"
						>
							{sortAZ ? t("annullaAZ") : t("ordinaAZ")}
						</button>
					</div>

					<input
						type="text"
						placeholder="Cerca..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="px-3 py-2 bg-white/40 border border-white/30 rounded-xl shadow-sm text-sm w-full sm:w-60 focus:outline-none backdrop-blur-md"
					/>

					{/* bottone Nuovo Ordine passato dal parent */}
					{customToolbar}
				</div>
			</div>

			{/* TABELLA */}
			<div className="w-full overflow-x-auto rounded-xl border border-white/10">
				<table className="w-full text-xs sm:text-sm text-[#090c64] border-auto">
					<thead>
						<tr className="bg-white/40 backdrop-blur-md text-[#090c64] border-y border-white/10">
							{columns.map((item, idx) => {
								const isCentered = centeredCols.includes(item);
								return (
									<th
										key={idx}
										className={`p-3 whitespace-nowrap ${
											isCentered ? "text-center" : "text-left"
										}`}
									>
										{columnsLabels[item] ?? t(item)}

									</th>
								);
							})}

							{actionLabel && (
								<th className="p-3 whitespace-nowrap text-center">
									{actionLabel}
								</th>
							)}
						</tr>
					</thead>

					<tbody>
						{filteredData.map((row) => {
							const isOpen = openRowId === row._id;
							const totalColumns =
								columns.length + (actions && actions.length > 0 ? 1 : 0);

							return (
								<React.Fragment key={row._id}>
									{/* RIGA PRINCIPALE */}
									<tr key={row._id} className="rounded-xl">
										{columns.map((col, j) => {
											// STATO → solo testo
											if (col === "stato") {
												return (
													<td key={j} className="p-3 text-center">
														{row.stato || "-"}
													</td>
												);
											}

											// CORRIERE → solo testo
											if (col === "corriere") {
												return (
													<td key={j} className="p-3 text-center">
														{row.corriere || "-"}
													</td>
												);
											}

											// PRODOTTO → freccia apri/chiudi dettaglio
											if (col === "prodotto") {
												return (
													<td key={j} className="p-3">
														<div className="flex items-center gap-3">
															<span
																className={`cursor-pointer text-base transition-transform ${
																	isOpen ? "rotate-180" : ""
																}`}
																onClick={(e) => {
																	e.stopPropagation();
																	setOpenRowId(isOpen ? null : row._id);
																	if (onRowClick) onRowClick(row);
																}}
															>
																⌵
															</span>
															<span>{row.prodotto}</span>
														</div>
													</td>
												);
											}

											// TOTALE → formattato €
											if (col === "totale") {
												return (
													<td key={j} className="p-3 text-center">
														{formatEuro(row.totale)}
													</td>
												);
											}

											const centered = centeredCols.includes(col);
											return (
												<td
													key={j}
													className={`p-3 ${centered ? "text-center" : ""}`}
												>
													{row[col] ?? "-"}
												</td>
											);
										})}

										{actions && actions.length > 0 && (
											<td className="p-3 flex gap-2 items-center justify-center">
												{actions.map((action) => (
													<button
														key={action.name}
														className="cursor-pointer"
														onClick={() => action.onClick(row)}
													>
														{action.icon}
													</button>
												))}
											</td>
										)}
									</tr>

									{/* FINESTRELLA DETTAGLI */}
									{isOpen && (
										<tr>
											<td colSpan={totalColumns} className="p-4">
												<div className="flex flex-col gap-6 p-4">
													{/* IMG + INFO PRODOTTO */}
													<div className="flex flex-col md:flex-row gap-3 items-start">
														{/* IMG PRODOTTO */}
														<div className="shrink-0 flex justify-center md:justify-start">
															{row.prodottoDettaglio?.image && (
																<img
																	src={row.prodottoDettaglio.image}
																	alt={
																		row.prodottoDettaglio.name ||
																		"Immagine prodotto"
																	}
																	className="max-w-[140px] rounded-xl object-cover shadow-md border border-white/40 bg-white/40"
																/>
															)}
														</div>

														{/* TESTO + PREZZO */}
														<div className="flex-1 flex flex-col justify-between gap-3 mt-1.5">
															<div>
																<h3 className="font-bold text-sm md:text-base">
																	{t("prodottoDettagli")}
																</h3>

																{/* Nome prodotto */}
																<p className="text-sm md:text-base font-semibold">
																	{row.prodottoDettaglio?.name || row.prodotto}
																</p>

																{/* Descrizione (se c'è) */}
																{row.prodottoDettaglio?.description && (
																	<p className="text-xs md:text-sm mt-1">
																		{row.prodottoDettaglio.description}
																	</p>
																)}
															</div>

															<div className="text-right flex flex-col items-end gap-2">
																<p className="text-sm md:text-base font-semibold">
																	{t("prezzoUnitario")}:{" "}
																	{row.prodottoDettaglio?.price
																		? formatEuro(row.prodottoDettaglio.price)
																		: "-"}
																</p>
															</div>
														</div>
													</div>

													{/* TITOLINO CLIENTI */}
													<div className="flex items-center justify-between mt-2">
														<h4 className="text-md font-semibold">
															{t("clienteDettagli")} ({row.clienti.length})
														</h4>
													</div>

													{/* GRID CLIENTI */}
													<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
														{row.clienti.map((cliente) => (
															<div
																key={cliente._id}
																className="rounded-2xl bg-[rgba(255,255,255,0.15)] border border-white/20 backdrop-blur-lg p-4 shadow-sm text-sm md:text-base flex flex-col gap-1"
															>
																{/* NOME + EMAIL */}
																<p className="font-bold">
																	{cliente.firstName} {cliente.lastName}
																</p>
																<p className="text-xs md:text-sm">
																	{cliente.email}
																</p>

																{/* TELEFONO */}
																{cliente.phoneNumber && (
																	<p className="text-xs md:text-sm">
																		{t("tel")}: {cliente.phoneNumber}
																	</p>
																)}

																{/* INDIRIZZO (se c'è) */}
																{cliente.location && (
																	<p className="text-xs md:text-sm">
																		{cliente.location.address},{" "}
																		{cliente.location.city}{" "}
																		{cliente.location.zipCode}
																	</p>
																)}

																{/* QTY + TOTALE */}
																<div className="flex justify-between mt-3 items-center text-xs md:text-sm">
																	<div className="flex items-center gap-2">
																		<span>Qty:</span>
																		<strong>{cliente.qty}</strong>
																	</div>
																	<span>
																		Tot:{" "}
																		<strong>
																			{formatEuro(cliente.totale)}
																		</strong>
																	</span>
																</div>
																<div className="mt-3 pt-3 border-t border-white/30 text-md flex flex-col gap-1">
																	{/* <div className="flex justify-between">
																		<span>Ordini totali:</span>
																		<strong>
																			{cliente.ordiniTotali ?? "-"}
																		</strong>
																	</div>

																	<div className="flex justify-between">
																		<span>Punti totali:</span>
																		<strong>{cliente.puntiTotali ?? 0}</strong>
																	</div> */}

																	<div className="flex justify-between font-bold ">
																		<span>{t("puntiOrdine")}:</span>
																		<span>+{cliente.puntiOrdine ?? 0}</span>
																	</div>
																</div>
															</div>
														))}
													</div>

													{/* RIEPILOGO QUANTITÀ / GIACENZA */}
													{(() => {
														const totalQuantity =
															Number(row["quantità totale"]) || 0;

														const totClientQty = Array.isArray(row.clienti)
															? row.clienti.reduce(
																	(sum, c) => sum + (Number(c.qty) || 0),
																	0
															  )
															: 0;

														const giacenza = totalQuantity - totClientQty;

														return (
															<div className="mt-4 flex flex-wrap gap-4 justify-end text-md">
																<div>
																	<span className="font-semibold">
																		{t("totaleOrdinatoClienti")}:{" "}
																	</span>
																	<span>{totClientQty}</span>
																</div>
																<div>
																	<span className="font-semibold">
																		{t("quantitaTotaleProdotto")}:{" "}
																	</span>
																	<span>{totalQuantity}</span>
																</div>
																<div>
																	<span className="font-semibold">
																		{t("giacenzaDisponibile")}:{" "}
																	</span>
																	<span>{giacenza}</span>
																</div>
															</div>
														);
													})()}
												</div>
											</td>
										</tr>
									)}
								</React.Fragment>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default OrdersTable;
