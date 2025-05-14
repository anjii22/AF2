import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCountryByCode } from '../api/countriesAPI';

const CountryDetail = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        setCountry(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load country details');
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

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
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center mb-8 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Flag Card with Zoom on Hover */}
          <div className="rounded-2xl overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <img 
              src={country.flags.svg || country.flags.png} 
              alt={`Flag of ${country.name.common}`}
              className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Country Info Section with Slide and Fade */}
          <div className="animate-slide-up animate-fade-in bg-white rounded-2xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {country.name.common}
            </h1>
            
            {country.name.official !== country.name.common && (
              <p className="text-lg text-gray-600 mb-6">
                <span className="font-medium text-gray-700">Official Name:</span> {country.name.official}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">Basic Info</h3>
                <ul className="space-y-2 text-gray-700">
                  <DetailItem label="Capital" value={country.capital?.join(', ') || 'N/A'} />
                  <DetailItem label="Region" value={`${country.region}${country.subregion ? ` (${country.subregion})` : ''}`} />
                  <DetailItem label="Population" value={formatNumber(country.population)} />
                  <DetailItem label="Area" value={`${formatNumber(country.area || 0)} km²`} />
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">Additional Info</h3>
                <ul className="space-y-2 text-gray-700">
                  <DetailItem label="Languages" value={getLanguages()} />
                  <DetailItem label="Currencies" value={getCurrencies()} />
                  <DetailItem label="Driving Side" value={country.car?.side?.charAt(0).toUpperCase() + country.car?.side?.slice(1) || 'N/A'} />
                  <DetailItem label="Timezones" value={country.timezones?.join(', ') || 'N/A'} />
                </ul>
              </div>
            </div>

            {country.borders && country.borders.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3 text-indigo-700">Border Countries</h3>
                <div className="flex flex-wrap gap-2">
                  {country.borders.map(border => (
                    <Link
                      key={border}
                      to={`/country/${border}`}
                      className="px-4 py-1 bg-white border border-gray-200 shadow-sm rounded-full hover:bg-gray-100 transition-all text-sm text-gray-800"
                    >
                      {border}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {country.maps && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Maps</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={country.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Google Maps
                    <svg 
                      className="w-4 h-4 ml-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                      />
                    </svg>
                  </a>
                  <a
                    href={country.maps.openStreetMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-md hover:bg-accent-600 transition-colors"
                  >
                    OpenStreetMap
                    <svg 
                      className="w-4 h-4 ml-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}
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