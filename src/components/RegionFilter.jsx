import { useState, useRef, useEffect } from 'react';

const regions = [
  { value: '', label: 'All Regions' },
  { value: 'africa', label: 'Africa' },
  { value: 'americas', label: 'Americas' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'oceania', label: 'Oceania' },
];

const RegionFilter = ({ onRegionChange, selectedRegion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRegionSelect = (region) => {
    onRegionChange(region);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get the currently selected region label
  const selectedRegionLabel = regions.find(r => r.value === selectedRegion)?.label || 'Filter by Region';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="select-field flex items-center justify-between w-full bg-white"
        onClick={toggleDropdown}
      >
        <span>{selectedRegionLabel}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg animate-fade-in">
          <ul className="py-1">
            {regions.map((region) => (
              <li key={region.value}>
                <button
                  type="button"
                  className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                    selectedRegion === region.value ? 'bg-primary-50 text-primary-600 font-medium' : ''
                  }`}
                  onClick={() => handleRegionSelect(region.value)}
                >
                  {region.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RegionFilter;