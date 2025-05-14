import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  ZoomableGroup 
} from 'react-simple-maps';

// URL to world geographies JSON
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

// Memoized component to prevent unnecessary re-renders
const WorldMap = memo(({ countries, setSelectedCountry }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [countriesData, setCountriesData] = useState({});
  const navigate = useNavigate();

  // Prepare a mapping of country codes to country data
  useEffect(() => {
    const dataMap = {};
    countries.forEach(country => {
      dataMap[country.cca3] = country;
    });
    setCountriesData(dataMap);
  }, [countries]);

  const handleMouseEnter = (geo, evt) => {
    const { NAME, ISO_A3 } = geo.properties;
    const country = countriesData[ISO_A3];
    
    if (country) {
      const population = country.population.toLocaleString();
      setTooltipContent(`${NAME}<br/>Population: ${population}`);
      setShowTooltip(true);
    } else {
      setTooltipContent(NAME);
      setShowTooltip(true);
    }
    
    setTooltipPosition({ x: evt.clientX, y: evt.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipContent('');
  };

  const handleMouseMove = (evt) => {
    setTooltipPosition({ x: evt.clientX, y: evt.clientY });
  };

  const handleClick = (geo) => {
    const { ISO_A3 } = geo.properties;
    const country = countriesData[ISO_A3];
    
    if (country) {
      navigate(`/country/${country.cca3}`);
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <ComposableMap
        projectionConfig={{
          scale: 140,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomableGroup zoom={1} center={[0, 0]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isActive = countriesData[geo.properties.ISO_A3];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    onClick={() => handleClick(geo)}
                    style={{
                      default: {
                        fill: isActive ? "#3B82F6" : "#D1D5DB",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: isActive ? "#2563EB" : "#9CA3AF",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: isActive ? "pointer" : "default",
                      },
                      pressed: {
                        fill: isActive ? "#1D4ED8" : "#9CA3AF",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {showTooltip && (
        <div
          className="absolute z-10 p-2 bg-white shadow-lg rounded text-sm pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 12}px`,
            top: `${tooltipPosition.y + 12}px`,
            transform: "translate(-50%, -100%)",
            minWidth: "120px",
            border: "1px solid #e2e8f0",
          }}
          dangerouslySetInnerHTML={{ __html: tooltipContent }}
        />
      )}
    </div>
  );
});

export default WorldMap;