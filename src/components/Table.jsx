import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Table = ({ data, columns, customToolbar, onRowClick }) => {
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
		<div className="w-full rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-4 sm:p-6 shadow-md border border-white flex flex-col gap-4">
			{/* TOOLBAR */}
			<div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 mb-3">
				{/* Left tools */}
				<div className="flex flex-wrap gap-2 items-center">
					<button
						onClick={() => setSortAZ(!sortAZ)}
						className="px-3 py-2 bg-white/70 border border-white rounded-xl shadow-sm text-sm hover:bg-white transition"
					>
						{sortAZ ? "Annulla Ordine A-Z" : "Ordina A-Z"}
					</button>

					{/* Custom toolbar from parent */}
					{customToolbar && customToolbar()}
				</div>

				{/* Search */}
				<input
					type="text"
					placeholder="Cerca..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="px-3 py-2 bg-white/70 border border-white rounded-xl shadow-sm text-sm w-full sm:w-60 focus:outline-none placeholder:text-gray-500"
				/>
			</div>

			{/* RESPONSIVE SCROLL WRAPPER */}
			<div className="w-full overflow-x-auto rounded-xl">
				<table className="w-full border-collapse text-xs sm:text-sm text-[#090c64]">
					<thead>
						<tr className="bg-white/60 text-[#090c64]">
							{columns.map((item, idx) => (
								<th
									key={idx}
									className={`
										p-3 whitespace-nowrap
										${idx === 0 ? "rounded-l-xl" : ""}
										${idx === columns.length - 1 ? "rounded-r-xl" : ""}
									`}
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
								className="hover:bg-white transition cursor-pointer"
								onClick={() => {
									if (onRowClick) onRowClick(row);
									else navigate(`/item/${row.id}`, { state: row });
								}}
							>
								{columns.map((col, j) => (
									<td
										key={j}
										className={`
											p-3 whitespace-nowrap md:whitespace-normal
											${j === 0 ? "rounded-l-xl" : ""}
											${j === columns.length - 1 ? "rounded-r-xl" : ""}
										`}
									>
										{row[col] !== null && row[col] !== undefined
											? String(row[col]).charAt(0).toUpperCase() +
											  String(row[col]).slice(1)
											: "-"}
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

export default Table;
