const FilterByCard = ({ onFilter }) => {
	return (
		<select
			onChange={(e) => onFilter(e.target.value)}
			className="px-3 py-2 bg-white/70 border border-white rounded-full shadow-sm text-sm"
		>
			<option value="">Tutte le tessere</option>
			<option value="Standard">Standard</option>
			<option value="Premium">Premium</option>
		</select>
	);
};

export default FilterByCard;
