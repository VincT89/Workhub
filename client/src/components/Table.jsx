import { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const Table = ({
	data,
	columns,
	columnLabels,
	customToolbar,
	actions,
	actionLabel = null,
	onRowClick,
	sortLogic = null,
}) => {

	const [searchTerm, setSearchTerm] = useState("");
	const [sortAZ, setSortAZ] = useState(false);

	const { t } = useLanguage();
	const { theme } = useTheme();
	
	const getColumnLabel = (col) => {
    if (columnLabels && columnLabels[col]) {
      return columnLabels[col];
    }
    return col.charAt(0).toUpperCase() + col.slice(1);
  };

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
		
		if (sortAZ && sortLogic != null) {
			result = [...result].sort(sortLogic);
		} else if (sortAZ && columns.length > 1) {
			const sortColumn = columns[1];
			result = [...result].sort((a, b) =>
				String(a[sortColumn] || "").localeCompare(String(b[sortColumn] || ""))
			);
		}

		return result;
	}, [searchTerm, data, columns, sortAZ]);

	return (
		<div className="w-full rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-4 sm:p-6 shadow-md  flex flex-col gap-4 table-wrapper">
			{/* TOOLBAR */}
			<div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 mb-3">
				{/* Left tools */}
				<div className="flex flex-wrap gap-2 items-center">
					<button
						onClick={() => setSortAZ(!sortAZ)}
						className="px-3 py-2 bg-[#090c64] text-white font-bold border border-white rounded-xl shadow-sm text-sm transition table-sort-btn"
					>
						{sortAZ ? t("annullaOrdineAZ") : t("ordinaAZ")}
					</button>

					{/* Custom toolbar from parent */}
					{customToolbar && customToolbar()}
				</div>

				{/* Search */}
				<input
					type="text"
					placeholder={t("cerca")}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="px-3 py-2 bg-white/70 border border-white rounded-xl shadow-sm text-sm w-full sm:w-60 focus:outline-none placeholder:text-gray-500 table-search"
				/>
			</div>

			{/* RESPONSIVE SCROLL WRAPPER */}
			<div className="w-full overflow-x-auto rounded-xl">
				<table className="w-full text-xs sm:text-sm text-[#090c64] border-auto">
					<thead className="font-bold bg-white/30">
						<tr className="bg-white/60 text-[#090c64]">
							{columns.map((item, idx) => (
								<th
									key={idx}
									className={`
										p-3 whitespace-nowrap max-w-max text-center
										${idx === 0 ? "rounded-l-xl" : ""}
										${!actionLabel && idx === columns.length - 1 ? "rounded-r-xl" : ""}
									`}
								>
									{getColumnLabel(item)}
								</th>
							))}
							{actionLabel && (
								<th
									className={`
										p-3 whitespace-nowrap rounded-r-xl
									`}
								>
									{actionLabel}
								</th>
							)}
						</tr>
					</thead>

					<tbody>
						{/* <tr
							className="hover:bg-white/40 transition cursor-pointer rounded-xl"
						>
							<td className="rounded-l-xl whitespace-nowrap p-3">Test</td>
							<td className="p-3">Test</td>
							<td className="rounded-r-xl whitespace-nowrap p-3">Test</td>
						</tr> */}
						{filteredData.map((row, i) => (
							<tr
								key={i}
								className="transition cursor-pointer rounded-xl tr-hover tr-last-rounded"
								onClick={() => onRowClick && onRowClick(row)}
							
							>
								{columns.map((col, j) => (
									<td
										key={j}
										className={`
											p-3 text-center
											${j === 0 ? "rounded-l-xl" : ""}
											${!actions && j === columns.length - 1 ? "rounded-r-xl" : ""}
										`}
									>
										{row[col] !== null && row[col] !== undefined
											? String(row[col]).charAt(0).toUpperCase() +
											  String(row[col]).slice(1)
											: "-"}
									</td>
								))}
								{actions && Array.isArray(actions) && actions.length > 0 && (
									<td
										key={`action-cell-${i}`}
										className={`
											p-3 flex gap-1 items-center justify-center
										`}
									>
										{
											actions.map(action => (
												<button key={action.name} className="cursor-pointer" onClick={typeof action.onClick === "function" ? () => action.onClick(row) : () => {}}>
													{
														action.icon
													}
												</button>
											))
										}
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{filteredData.length === 0 && (
				<p className="text-center text-gray-500 italic mt-2">
					{t("nessunRisultatoTrovato")}
				</p>
			)}
		</div>
	);
};

export default Table;