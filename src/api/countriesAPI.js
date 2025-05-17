import axios from 'axios';

// Validate and set the base URL for the REST Countries API
const BASE_URL = import.meta.env.VITE_COUNTRIES_URL;
if (!BASE_URL) {
  throw new Error('VITE_COUNTRIES_URL is not defined in environment variables.');
}

// Get all countries with selected fields
export const getAllCountries = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/all?fields=name,capital,population,region,subregion,languages,flags,cca3,maps,borders`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all countries:', error.message);
    throw new Error('Failed to fetch countries');
  }
};

// Search countries by name
export const searchCountriesByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return []; // Gracefully handle not found
    }
    console.error('Error searching countries by name:', error.message);
    throw new Error('Failed to fetch country by name'); // ✅ matches test expectation
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries by region:', error.message);
    throw new Error('Failed to fetch countries by region');
  }
};

// Get country by 3-letter code (e.g., 'JPN')
export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/alpha/${code}`);
    if (!response.data || response.data.length === 0) {
      throw new Error('Country not found'); // ✅ causes test to reject
    }
    return response.data[0];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Country not found'); // ✅ ensures rejection, not undefined
    }
    console.error('Error fetching country by code:', error.message);
    throw new Error('Failed to fetch country by code');
  }
};

// Extract all unique languages from a countries array
export const extractLanguages = (countries) => {
  const languagesSet = new Set();

  countries.forEach((country) => {
    if (country.languages) {
      Object.values(country.languages).forEach((language) => {
        languagesSet.add(language);
      });
    }
  });

  return Array.from(languagesSet).sort();
};

// Filter countries by a specific language (case-insensitive)
export const filterCountriesByLanguage = (countries, language) => {
  if (!language) return countries;

  return countries.filter(
    (country) =>
      country.languages &&
      Object.values(country.languages).some(
        (lang) => lang.toLowerCase() === language.toLowerCase()
      )
  );
};
