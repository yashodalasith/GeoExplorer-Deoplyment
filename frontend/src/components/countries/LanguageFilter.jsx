import { useState, useEffect } from "react";
import { getAllLanguages } from "../../services/countriesService";

const LanguageFilter = ({ onFilter, selectedLanguage }) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await getAllLanguages(); // Now returns [code, name] pairs
        setLanguages(langs);
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    onFilter(e.target.value); // Pass the language code (e.g., "spa")
  };

  if (loading) return <div>Loading languages...</div>;

  return (
    <select
      value={selectedLanguage}
      onChange={handleChange}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
    >
      <option value="">Filter by Language</option>
      {languages.map(([code, name]) => (
        <option key={code} value={code}>
          {name} ({code})
        </option>
      ))}
    </select>
  );
};

export default LanguageFilter;
