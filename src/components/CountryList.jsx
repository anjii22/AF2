import { useState, useEffect } from 'react';
import CountryCard from './CountryCard';

const CountryList = ({ countries, loading, error }) => {
  const [visibleCount, setVisibleCount] = useState(20);

  // Reset visible count when countries change
  useEffect(() => {
    setVisibleCount(20);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [countries]);

  // Load more countries
  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Countries</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Countries Found</h3>
        <p className="text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  const visibleCountries = [...countries]
    .sort((a, b) => a.name.common.localeCompare(b.name.common))
    .slice(0, visibleCount);

  const hasMore = visibleCount < countries.length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="btn btn-primary"
          >
            Load More Countries
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryList;
