import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
<<<<<<< HEAD
const Table = ({ data, columns, customToolbar, onRowClick }) => {
=======
const Table = ({ data, columns, customToolbar }) => {

	// PER RIGA TABELLA CLICCABILE CHE PORTA A PAGINA PRODOTTO
>>>>>>> 26891ab2e400bf5f0d09de2bd563e143844ca533
=======
const Table = ({ data, columns, customToolbar, onRowClick }) => {
>>>>>>> feature/core
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState("");
	const [sortAZ, setSortAZ] = useState(false);

	const filteredData = useMemo(() => {
		const query = searchTerm.toLowerCase();

		let result = data.filter((row) =>
			columns.some((col) => {
				const value = row[col];
				if (value === null || value === undefined) return false;

				const normalizedValue = String(value)
					.toLowerCase()
					.replace(/\s+/g, "")
					.replace(/\+/g, "");

				const normalizedQuery = query.replace(/\s+/g, "").replace(/\+/g, "");

				return normalizedValue.includes(normalizedQuery);
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

	return (
<<<<<<< HEAD
<<<<<<< HEAD
		<div className="w-full rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md border border-white bg-white/10 flex flex-col gap-4">
			{/* TOOLBAR */}
			<div className="flex flex-wrap items-center justify-between gap-3 mb-3">
				{/* Left tools */}
=======
		<div className="w-full rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md border border-white bg-white/40 flex flex-col gap-4">

			{/* TOOLBAR */}
			<div className="flex flex-wrap items-center justify-between gap-3 mb-3">
				{/* tools che staranno a sinistra */}
>>>>>>> 26891ab2e400bf5f0d09de2bd563e143844ca533
				<div className="flex gap-2 items-center">
					<button
						onClick={() => setSortAZ(!sortAZ)}
						className="px-3 py-2 bg-white/70 border border-white rounded-full shadow-sm text-sm hover:bg-white transition"
=======
		<div className="w-full rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-4 sm:p-6 shadow-md border border-white flex flex-col gap-4">
			{/* TOOLBAR */}
			<div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 mb-3">
				{/* Left tools */}
				<div className="flex flex-wrap gap-2 items-center">
					<button
						onClick={() => setSortAZ(!sortAZ)}
						className="px-3 py-2 bg-[#090c64] text-white font-bold border border-white rounded-xl shadow-sm text-sm transition"
>>>>>>> feature/core
					>
						{sortAZ ? "Annulla Ordine A-Z" : "Ordina A-Z"}
					</button>

<<<<<<< HEAD
<<<<<<< HEAD
					{/* Custom toolbar from parent */}
=======
					{/* Custom tools da inserire nel proprio componente e da creare come componente */}
>>>>>>> 26891ab2e400bf5f0d09de2bd563e143844ca533
=======
					{/* Custom toolbar from parent */}
>>>>>>> feature/core
					{customToolbar && customToolbar()}
				</div>

				{/* Search */}
				<input
					type="text"
					placeholder="Cerca..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
					className="px-3 py-2 bg-white/70 border border-white rounded-full shadow-sm text-sm w-60 focus:outline-none placeholder:text-gray-500"
=======
					className="px-3 py-2 bg-white/70 border border-white rounded-xl shadow-sm text-sm w-full sm:w-60 focus:outline-none placeholder:text-gray-500"
>>>>>>> feature/core
				/>
			</div>

			{/* RESPONSIVE SCROLL WRAPPER */}
			<div className="w-full overflow-x-auto rounded-xl">
<<<<<<< HEAD
				<table className="w-full min-w-max border-collapse text-sm text-[#090c64]">
=======
				<table className="w-full border-collapse text-xs sm:text-sm text-[#090c64]">
>>>>>>> feature/core
					<thead>
						<tr className="bg-white/60 text-[#090c64]">
							{columns.map((item, idx) => (
								<th
									key={idx}
									className={`
<<<<<<< HEAD
                    p-3 whitespace-nowrap
                    ${idx === 0 ? "rounded-l-xl" : ""}
                    ${idx === columns.length - 1 ? "rounded-r-xl" : ""}
                  `}
=======
										p-3 whitespace-nowrap
										${idx === 0 ? "rounded-l-xl" : ""}
										${idx === columns.length - 1 ? "rounded-r-xl" : ""}
									`}
>>>>>>> feature/core
								>
									{item.charAt(0).toUpperCase() + item.slice(1)}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{filteredData.map((row, i) => (
							<tr
								key={i}
<<<<<<< HEAD
								className="hover:bg-white transition cursor-pointer"
								onClick={() => { // Gestione click riga, prima era fisso quindi al click andava a item/id, ora è opzionale in modo che chi non ha la pagina dettaglio ma un drawer puo' usarla lo stesso
									if (onRowClick) onRowClick(row); //
=======
								className="hover:bg-white/40 transition cursor-pointer"
								onClick={() => {
									if (onRowClick) onRowClick(row);
>>>>>>> feature/core
									else navigate(`/item/${row.id}`, { state: row });
								}}
							>
								{columns.map((col, j) => (
									<td
										key={j}
										className={`
<<<<<<< HEAD
                      p-3 whitespace-nowrap
                      ${j === 0 ? "rounded-l-xl" : ""}
                      ${j === columns.length - 1 ? "rounded-r-xl" : ""}
                    `}
									>
										{String(row[col]).charAt(0).toUpperCase() +
											String(row[col]).slice(1)}
=======
											p-3 whitespace-nowrap md:whitespace-normal
											${j === 0 ? "rounded-l-xl" : ""}
											${j === columns.length - 1 ? "rounded-r-xl" : ""}
										`}
									>
										{row[col] !== null && row[col] !== undefined
											? String(row[col]).charAt(0).toUpperCase() +
											  String(row[col]).slice(1)
											: "-"}
>>>>>>> feature/core
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{filteredData.length === 0 && (
				<p className="text-center text-gray-500 italic mt-2">
					Nessun risultato trovato.
				</p>
			)}
		</div>
	);
};

<<<<<<< HEAD
export default Table;
=======
export default Table;
>>>>>>> feature/core
