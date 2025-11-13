import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Table = ({ data, columns, onClick }) => {
	// PER RIGA TABELLA CLICCABILE CHE PORTA A PAGINA PRODOTTO
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState("");
	const [sortAZ, setSortAZ] = useState(false);

	const filteredData = useMemo(() => {
		const query = searchTerm.toLowerCase();

		// Filtra i dati
		let result = data.filter((row) =>
			columns.some((col) => {
				const value = row[col];
				if (value === null || value === undefined) return false;

				const normalizedValue = String(value)
					.toLowerCase()
					.replace(/\s+/g, "") // rimuove spazi
					.replace(/\+/g, ""); // rimuove +

				const normalizedQuery = query.replace(/\s+/g, "").replace(/\+/g, "");

				return normalizedValue.includes(normalizedQuery);
			})
		);

		// Ordinamento alfabetico sulla prima colonna
		if (sortAZ && columns.length > 1) {
			const sortColumn = columns[1];
			result = [...result].sort((a, b) => {
				const aVal = String(a[sortColumn] || "").toLowerCase();
				const bVal = String(b[sortColumn] || "").toLowerCase();
				return aVal.localeCompare(bVal);
			});
		}

		return result;
	}, [searchTerm, data, columns, sortAZ]);

	return (
		<div className="w-full rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md border border-white bg-white/40 flex flex-col gap-4">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center justify-between gap-3 mb-3">
				<div className="flex gap-2">
					<button
						onClick={() => setSortAZ(!sortAZ)}
						className="px-3 py-2 bg-white/70 border border-white rounded-full shadow-sm text-sm hover:bg-white transition"
					>
						{sortAZ ? "Annulla Ordine A-Z" : "Ordina A-Z"}
					</button>
				</div>

				<input
					type="text"
					placeholder="Cerca..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="px-3 py-2 bg-white/70 border border-white rounded-full shadow-sm text-sm w-60 focus:outline-none placeholder:text-gray-500"
				/>
			</div>

			{/* Tabella */}
			<table className="w-full border-collapse text-sm text-[#134a7b]">
				<thead>
					<tr className="bg-white/60 rounded-full">
						{columns.map((item, idx) => (
							<th
								key={idx}
								className={`p-3 text-[#134a7b] bg-transparent

                                ${idx === 0 ? "rounded-l-xl" : ""}
                                ${
																	idx === columns.length - 1
																		? "rounded-r-xl"
																		: ""
																}`}
							>
								{item.charAt(0).toUpperCase() + item.slice(1)}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{filteredData.map((row, i) => (
						// CLICK PER APRIRE PRODOTTO E STILE RIGA
						<tr
							key={i}
							className="bg-transparent hover:bg-white transition cursor-pointer"
							onClick={() => navigate(`/product/${row.id}`)} // 👈 apre la pagina prodotto
						>
							{columns.map((col, j) => (
								<td
									key={j}
									className={`p-3 text-[#134a7b] bg-transparent

                                  ${j === 0 ? "rounded-l-xl" : ""}
                                  ${
																		j === columns.length - 1
																			? "rounded-r-xl"
																			: ""
																	}`}
								>
									{/* condizione inline:
                                j === 0 → controlla se siamo nella prima colonna (indice 0).
                                Se sì → aggiunge la classe rounded-l-xl, che arrotonda gli angoli sinistri della cella (in alto e in basso).
                                Se no → aggiunge una stringa vuota, cioè nessuna classe.

                                columns.length - 1 restituisce l’indice dell’ultima colonna dell’array.
                                Se j corrisponde a quell’indice → viene aggiunta la classe rounded-r-xl.
                                */}

									{String(row[col]).charAt(0).toUpperCase() +
										String(row[col]).slice(1)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			{filteredData.length === 0 && (
				<p className="text-center text-gray-500 italic mt-2">
					Nessun risultato trovato.
				</p>
			)}
		</div>
	);
};

export default Table;
