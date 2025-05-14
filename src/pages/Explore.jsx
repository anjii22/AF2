import { useState, useEffect } from 'react';
import { 
  getAllCountries, 
  searchCountriesByName, 
  getCountriesByRegion,
  extractLanguages,
  filterCountriesByLanguage
} from '../api/countriesAPI';
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

  // Fetch all countries on initial load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        
        // Extract languages
        const extractedLanguages = extractLanguages(data);
        setLanguages(extractedLanguages);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load countries data. Please try again later.');
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      // If search term is empty, reset to filtered by region/language
      applyFilters(selectedRegion, selectedLanguage, countries);
      return;
    }

    try {
      setLoading(true);
      
      // Get countries by name search
      const searchResults = await searchCountriesByName(term);
      
      // Apply current region and language filters to search results
      applyFilters(selectedRegion, selectedLanguage, searchResults);
      
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
      } else {
        // If no region selected, use all countries
        regionalCountries = countries;
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
    applyFilters(selectedRegion, language, filteredCountries);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Explore Countries</h1>
          <p className="text-gray-600">
            Discover information about countries around the world. Use the filters below to narrow your search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <RegionFilter 
              onRegionChange={handleRegionChange} 
              selectedRegion={selectedRegion} 
            />
            {/* <LanguageFilter 
              languages={languages} 
              onLanguageChange={handleLanguageChange} 
              selectedLanguage={selectedLanguage} 
            /> */}
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </>
            ) : (
              <>
                <span className="mr-2">Show Map</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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