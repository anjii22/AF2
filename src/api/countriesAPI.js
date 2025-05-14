import axios from 'axios';

// Set the base URL for the API
const BASE_URL = "https://restcountries.com/v3.1";

// Get all countries with essential fields
export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all?fields=name,capital,population,region,subregion,languages,flags,cca3,maps,borders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

// Search countries by name
export const searchCountriesByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No countries found with the given name
      return [];
    }
    console.error('Error searching countries by name:', error);
    throw error;
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries by region:', error);
    throw error;
  }
};

// Get country by code
export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/alpha/${code}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching country by code:', error);
    throw error;
  }
};

// Extract all unique languages from countries data
export const extractLanguages = (countries) => {
  const languagesSet = new Set();
  
  countries.forEach(country => {
    if (country.languages) {
      Object.values(country.languages).forEach(language => {
        languagesSet.add(language);
      });
    }
  });
  
  return Array.from(languagesSet).sort();
};

// Filter countries by language
export const filterCountriesByLanguage = (countries, language) => {
  if (!language) return countries;
  
  return countries.filter(country => {
    if (!country.languages) return false;
    return Object.values(country.languages).some(lang => 
      lang.toLowerCase() === language.toLowerCase()
    );
  });
};
