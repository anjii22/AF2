import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">About World Map Explorer</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Project Overview</h2>
          <p className="text-gray-600 mb-6">
            World Map Explorer is an interactive web application that provides users with detailed information about countries around the world. The application leverages the REST Countries API to retrieve comprehensive data about different nations, their geography, demographics, languages, and more.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Key Features</h3>
              <ul className="space-y-2 text-gray-600">
                {/* <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  Interactive world map visualization
                </li> */}
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  Search functionality for finding countries by name
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  Filter countries by region 
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  Detailed country information including flags, population, languages
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  Responsive design for all device sizes
                </li>
                {/* <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  User session management
                </li> */}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Technologies Used</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  React 
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  JavaScript 
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  Tailwind CSS for styling
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  React Router for navigation
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  Axios for API requests
                </li>
                {/* <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  React Simple Maps for map visualization
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        
        {/* <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">API Integration</h2>
          <p className="text-gray-600 mb-6">
            This application integrates with the REST Countries API to fetch country data. The following endpoints are used:
          </p>
          
          <div className="space-y-4 mb-6">
            <ApiEndpoint 
              method="GET" 
              endpoint="/all" 
              description="Retrieves a list of all countries with essential fields." 
            />
            <ApiEndpoint 
              method="GET" 
              endpoint="/name/{name}" 
              description="Searches for countries by name." 
            />
            <ApiEndpoint 
              method="GET" 
              endpoint="/region/{region}" 
              description="Gets countries from a specific region." 
            />
            <ApiEndpoint 
              method="GET" 
              endpoint="/alpha/{code}" 
              description="Retrieves detailed information about a country using its code." 
            />
          </div>
          
          <p className="text-gray-600">
            For more information about the REST Countries API, visit their <a href="https://restcountries.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">official documentation</a>.
          </p>
        </div> */}
        
        <div className="text-center">
          <Link to="/explore" className="btn btn-primary inline-block px-8 py-3">
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  );
};

const ApiEndpoint = ({ method, endpoint, description }) => (
  <div className="p-4 border border-gray-200 rounded-lg">
    <div className="flex items-start mb-2">
      <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-primary-100 text-primary-800 mr-2">
        {method}
      </span>
      <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono text-sm">
        {endpoint}
      </code>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default About;