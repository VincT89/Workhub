const FilterByCard = ({ onFilter }) => {
	return (
		<select
			onChange={(e) => onFilter(e.target.value)}
			className="px-3 py-2 bg-[#090c64] font-bold border border-white rounded-xl shadow-sm text-sm text-white cursor-pointer"
		>
			<option value="">Tutte le tessere</option>
			<option value="standard">Standard</option>
			<option value="premium">Premium</option>
		</select>
	);
};

export default FilterByCard;