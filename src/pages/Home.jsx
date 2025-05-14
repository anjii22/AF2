import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCountries } from '../api/countriesAPI';
import WorldMap from '../components/WorldMap';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCountries: 0,
    totalPopulation: 0,
    continents: 0,
    languages: 0
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
        
        // Calculate statistics
        const continentsSet = new Set();
        const languagesSet = new Set();
        let totalPopulation = 0;
        
        data.forEach(country => {
          totalPopulation += country.population;
          continentsSet.add(country.region);
          
          if (country.languages) {
            Object.values(country.languages).forEach(language => {
              languagesSet.add(language);
            });
          }
        });
        
        setStats({
          totalCountries: data.length,
          totalPopulation: totalPopulation,
          continents: continentsSet.size,
          languages: languagesSet.size
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch countries data:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-primary-50 to-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Explore Our <span className="text-primary-600">World</span> Like Never Before
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Discover detailed information about countries, their cultures, geography, and more with our interactive world map explorer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/explore"
                  className="btn btn-primary px-8 py-3 text-center rounded-lg"
                >
                  Start Exploring
                </Link>
                <Link
                  to="/about"
                  className="btn bg-white text-primary-600 border border-primary-200 px-8 py-3 text-center rounded-lg hover:bg-primary-50"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 h-[300px] sm:h-[400px]">
              {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <WorldMap countries={countries} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              title="Countries"
              value={stats.totalCountries.toLocaleString()}
              icon="🏳️"
            />
            <StatCard
              title="Population"
              value={`${Math.round(stats.totalPopulation / 1000000000).toLocaleString()} B`}
              icon="👥"
            />
            <StatCard
              title="Continents"
              value={stats.continents}
              icon="🌎"
            />
            <StatCard
              title="Languages"
              value={stats.languages.toLocaleString()}
              icon="🗣️"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-16 px-4 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Interactive Map"
              description="Explore countries through our interactive world map with zoom capabilities and country highlighting."
              icon="🗺️"
            />
            <FeatureCard
              title="Detailed Information"
              description="Get comprehensive data about countries including population, languages, currencies, and more."
              icon="📊"
            />
            <FeatureCard
              title="Advanced Filtering"
              description="Filter countries by region, language, or use our powerful search functionality to find specific countries."
              icon="🔍"
            />
          </div>
        </div>
      </section> */}
      
      {/* CTA Section */}
      {/* <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore the World?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Start your journey today and discover fascinating facts about countries around the globe.
          </p>
          <Link
            to="/explore"
            className="inline-block bg-white text-primary-600 font-medium px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section> */}
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-primary-600 mb-1">{value}</div>
    <div className="text-gray-500">{title}</div>
  </div>
);

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;