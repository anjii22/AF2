import { useState, useRef, useEffect } from 'react';

const LanguageFilter = ({ languages, onLanguageChange, selectedLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageSelect = (language) => {
    onLanguageChange(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Filter languages based on search term
  const filteredLanguages = languages.filter(language => 
    language.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="select-field flex items-center justify-between w-full bg-white"
        onClick={toggleDropdown}
      >
        <span>{selectedLanguage || 'Filter by Language'}</span>
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg animate-fade-in max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-white p-2 border-b">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <ul className="py-1">
            <li>
              <button
                type="button"
                className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                  !selectedLanguage ? 'bg-primary-50 text-primary-600 font-medium' : ''
                }`}
                onClick={() => handleLanguageSelect('')}
              >
                All Languages
              </button>
            </li>
            
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <li key={language}>
                  <button
                    type="button"
                    className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      selectedLanguage === language ? 'bg-primary-50 text-primary-600 font-medium' : ''
                    }`}
                    onClick={() => handleLanguageSelect(language)}
                  >
                    {language}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 italic">No languages found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageFilter;