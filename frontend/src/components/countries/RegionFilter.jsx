const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

const RegionFilter = ({ onFilter, selectedRegion }) => {
  const handleChange = (e) => {
    onFilter(e.target.value);
  };

  return (
    <select
      value={selectedRegion}
      onChange={handleChange}
      className="block w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
    >
      <option value="">Filter by Region</option>
      {regions.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
};

export default RegionFilter;
