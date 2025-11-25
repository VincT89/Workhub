const FilterByCard = ({ onFilter }) => {
	return (
		<select
			onChange={(e) => onFilter(e.target.value)}
			className="px-3 py-2 bg-[#090c64] font-bold border border-white rounded-xl shadow-sm text-sm text-white"
		>
			<option value="">Tutte le tessere</option>
			<option value="Standard">Standard</option>
			<option value="Premium">Premium</option>
		</select>
	);
};

export default FilterByCard;