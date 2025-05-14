import { Link } from 'react-router-dom';

const CountryCard = ({ country }) => {
  // Format population with commas
  const formatPopulation = (population) => {
    return population.toLocaleString();
  };

  // Get the first language (if available)
  const getLanguages = () => {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  };

  // Get capital or return N/A
  const getCapital = () => {
    if (!country.capital || country.capital.length === 0) return 'N/A';
    return country.capital[0];
  };

  return (
    <Link 
      to={`/country/${country.cca3}`}
      className="card block h-full transform transition-all duration-300 hover:scale-105"
    >
      <div className="relative pb-[56.25%] w-full overflow-hidden">
        <img
          src={country.flags.svg || country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-1">
          {country.name.common}
        </h3>
        
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Population:</span> {formatPopulation(country.population)}
          </p>
          <p>
            <span className="font-medium">Region:</span> {country.region}
          </p>
          <p>
            <span className="font-medium">Capital:</span> {getCapital()}
          </p>
          <p className="line-clamp-1">
            <span className="font-medium">Languages:</span> {getLanguages()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;