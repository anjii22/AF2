import { useState, useEffect } from 'react';
import { 
  getAllCountries, 
  searchCountriesByName, 
  getCountriesByRegion,
  extractLanguages,
  filterCountriesByLanguage,
  getCountryByCode
} from '../api/countriesAPI';
import { getFavorites } from '../utils/authUtils';
import SearchBar from '../components/SearchBar';
import RegionFilter from '../components/RegionFilter';
import LanguageFilter from '../components/LanguageFilter';
import CountryList from '../components/CountryList';
import WorldMap from '../components/WorldMap';

const Explore = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languages, setLanguages] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteCountries, setFavoriteCountries] = useState([]);

  // Fetch all countries and favorites on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allCountries, favorites] = await Promise.all([
          getAllCountries(),
          Promise.all(getFavorites().map(code => getCountryByCode(code)))
        ]);
        
        setCountries(allCountries);
        setFilteredCountries(allCountries);
        setFavoriteCountries(favorites);
        
        // Extract languages
        const extractedLanguages = extractLanguages(allCountries);
        setLanguages(extractedLanguages);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load countries data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      // If search term is empty, reset to filtered by region/language
      applyFilters(selectedRegion, selectedLanguage, showFavorites ? favoriteCountries : countries);
      return;
    }

    try {
      setLoading(true);
      
      // Get countries by name search
      const searchResults = await searchCountriesByName(term);
      
      // If showing favorites, filter search results to only include favorites
      const baseResults = showFavorites 
        ? searchResults.filter(country => 
            favoriteCountries.some(fav => fav.cca3 === country.cca3)
          )
        : searchResults;
      
      // Apply current region and language filters
      applyFilters(selectedRegion, selectedLanguage, baseResults);
      
      setLoading(false);
    } catch (err) {
      setError('Error searching for countries');
      setFilteredCountries([]);
      setLoading(false);
    }
  };

  // Handle region filter
  const handleRegionChange = async (region) => {
    setSelectedRegion(region);
    
    try {
      setLoading(true);
      
      let regionalCountries;
      if (region) {
        // Get countries by region
        regionalCountries = await getCountriesByRegion(region);
        
        // If showing favorites, filter to only include favorites
        if (showFavorites) {
          regionalCountries = regionalCountries.filter(country =>
            favoriteCountries.some(fav => fav.cca3 === country.cca3)
          );
        }
      } else {
        // If no region selected, use all countries or favorites
        regionalCountries = showFavorites ? favoriteCountries : countries;
      }
      
      // Apply current search term and language filter
      if (searchTerm) {
        regionalCountries = regionalCountries.filter(country =>
          country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply language filter
      applyFilters(region, selectedLanguage, regionalCountries);
      
      setLoading(false);
    } catch (err) {
      setError('Error filtering countries by region');
      setFilteredCountries([]);
      setLoading(false);
    }
  };

  // Handle language filter
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    applyFilters(selectedRegion, language, showFavorites ? favoriteCountries : filteredCountries);
  };

  // Toggle between all countries and favorites
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setFilteredCountries(favoriteCountries);
    } else {
      setFilteredCountries(countries);
    }
  };

  // Apply both region and language filters
  const applyFilters = (region, language, countriesData) => {
    let filtered = countriesData;
    
    // Apply language filter if selected
    if (language) {
      filtered = filterCountriesByLanguage(filtered, language);
    }
    
    setFilteredCountries(filtered);
  };

  // Toggle between map and list view
  const toggleView = () => {
    setShowMap(!showMap);
  };

  const countryCount = filteredCountries.length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container-custom">
        <div className="mb-10 bg-gradient-to-r from-blue-20 via-white to-blue-100 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-blue-500 mb-3 tracking-wide drop-shadow-sm">
            🌍 Explore Countries
          </h1>
          <p className="text-black-700 text-lg  leading-relaxed">
            Discover information about countries around the world. Use the filters below to narrow your search.
          </p>
        </div>


        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[300px]">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <div className="flex gap-4">
            <RegionFilter 
              onRegionChange={handleRegionChange} 
              selectedRegion={selectedRegion} 
            />
            {/* <LanguageFilter 
              languages={languages} 
              onLanguageChange={handleLanguageChange} 
              selectedLanguage={selectedLanguage} 
            /> */}
            <button
              onClick={toggleFavorites}
              className={`px-4 py-2 rounded-md transition-colors ${
                showFavorites
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {showFavorites ? 'Show All' : 'Show Favorites'}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            {loading 
              ? 'Loading countries...' 
              : `Showing ${countryCount} ${countryCount === 1 ? 'country' : 'countries'}`
            }
          </div>
          {/* <button
            onClick={toggleView}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {showMap ? (
              <>
                <span className="mr-2">Show List</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </>
            ) : (
              <>
                <span className="mr-2">Show Map</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </>
            )}
          </button> */}
        </div>

        {/* {showMap && !loading && filteredCountries.length > 0 && (
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <WorldMap countries={filteredCountries} />
          </div>
        )} */}

        <CountryList 
          countries={filteredCountries} 
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Explore;