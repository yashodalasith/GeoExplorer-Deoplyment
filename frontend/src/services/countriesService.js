import axios from "axios";

const API_BASE = "https://restcountries.com/v3.1";

export const getAllCountries = async () => {
  const response = await axios.get(`${API_BASE}/all`);
  return response.data;
};

export const getCountryByCode = async (code) => {
  const response = await axios.get(`${API_BASE}/alpha/${code}`);
  return response.data[0];
};

export const getCountriesByCodes = async (codes) => {
  const response = await axios.get(
    `${API_BASE}/alpha?codes=${codes.join(",")}`
  );
  return response.data;
};

export const searchCountries = async (name) => {
  const response = await axios.get(`${API_BASE}/name/${name}`);
  return response.data;
};

export const getCountriesByRegion = async (region) => {
  const response = await axios.get(`${API_BASE}/region/${region}`);
  return response.data;
};

export const getCountriesByLanguage = async (languageCode) => {
  const response = await axios.get(`${API_BASE}/lang/${languageCode}`);
  return response.data;
};

// New: Fetch all unique language codes + names
export const getAllLanguages = async () => {
  const response = await axios.get(`${API_BASE}/all?fields=languages`);
  const countries = response.data;

  const languageMap = new Map();
  countries.forEach((country) => {
    if (country.languages) {
      Object.entries(country.languages).forEach(([code, name]) => {
        languageMap.set(code, name);
      });
    }
  });

  return Array.from(languageMap.entries()).sort((a, b) =>
    a[1].localeCompare(b[1])
  );
};
