import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCountryByCode } from '../api/countriesAPI';
import { toggleFavorite, isFavorite } from '../utils/authUtils';

const CountryDetail = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        setCountry(data);
        setFavorite(isFavorite(code));
        setLoading(false);
      } catch (err) {
        setError('Failed to load country details');
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  const handleFavoriteClick = () => {
    const newFavoriteStatus = toggleFavorite(code);
    setFavorite(newFavoriteStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container-custom">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="container-custom">
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-red-500 mb-4">{error || 'Country not found'}</p>
            <button 
              onClick={() => navigate('/explore')}
              className="btn bg-red-500 text-white hover:bg-red-600"
            >
              Return to Explore
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format population with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Get languages as a comma-separated string
  const getLanguages = () => {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  };

  // Get currencies as a comma-separated string
  const getCurrencies = () => {
    if (!country.currencies) return 'N/A';
    return Object.values(country.currencies)
      .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
      .join(', ');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back
          </button>

          
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Flag + Favorite */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <button
                onClick={handleFavoriteClick}
                className={`absolute top-3 right-3 z-10 flex items-center justify-center p-2 rounded-full shadow-md transition-colors ${
                  favorite 
                    ? 'bg-primary-500 text-white hover:bg-primary-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill={favorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              <img 
                src={country.flags.svg || country.flags.png} 
                alt={`Flag of ${country.name.common}`}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Country Info Section */}
            <div className="animate-slide-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {country.name.common}
              </h1>
              
              {country.name.official !== country.name.common && (
                <p className="text-lg text-gray-700 mb-6">
                  <span className="font-medium">Official Name:</span> {country.name.official}
                </p>
              )}

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Basic Info Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.01]">
                  <h3 className="text-xl font-bold text-primary-600 mb-4 border-b pb-2">🌍 Basic Info</h3>
                  <ul className="space-y-3 text-gray-800">
                    <DetailItem label="Capital" value={country.capital?.join(', ') || 'N/A'} />
                    <DetailItem label="Region" value={`${country.region}${country.subregion ? ` (${country.subregion})` : ''}`} />
                    <DetailItem label="Population" value={formatNumber(country.population)} />
                    <DetailItem label="Area" value={`${formatNumber(country.area || 0)} km²`} />
                  </ul>
                </div>

                {/* Additional Info Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.01]">
                  <h3 className="text-xl font-bold text-accent-600 mb-4 border-b pb-2">📌 Additional Info</h3>
                  <ul className="space-y-3 text-gray-800">
                    <DetailItem label="Languages" value={getLanguages()} />
                    <DetailItem label="Currencies" value={getCurrencies()} />
                    <DetailItem label="Driving Side" value={country.car?.side?.charAt(0).toUpperCase() + country.car?.side?.slice(1) || 'N/A'} />
                    <DetailItem label="Timezones" value={country.timezones?.join(', ') || 'N/A'} />
                  </ul>
                </div>
              </div>

              {/* Border Countries */}
              {country.borders && country.borders.length > 0 && (
                <div className="mt-10 bg-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.01]">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 w-full">Border Countries</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {country.borders.map(border => (
                        <Link
                          key={border}
                          to={`/country/${border}`}
                          className="px-4 py-1.5 bg-primary-50 text-black border border-primary-100 rounded-full text-sm font-medium hover:bg-primary-100 transition"
                        >
                          {border}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Map Links */}
              {country.maps && (
                <div className="mt-10 bg-white shadow-lg rounded-xl p-6 transition-transform hover:scale-[1.01]">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 w-full">Maps</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      <a
                        href={country.maps.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                      >
                        Google Maps
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>

                      <a
                        href={country.maps.openStreetMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-md hover:bg-accent-600 transition-colors"
                      >
                        OpenStreetMap
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <li>
    <span className="font-medium">{label}:</span> {value}
  </li>
);

export default CountryDetail;