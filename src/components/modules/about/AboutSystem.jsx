import React from 'react';
import { Code, Server, Monitor } from 'lucide-react';

const AboutSystem = () => {
  const technologies = [
    { name: 'React', version: '18.2.0' },
    { name: 'Vite', version: '5.0.8' },
    { name: 'Tailwind CSS', version: '3.4.0' },
    { name: 'Supabase', version: '2.47.10' },
    { name: 'React Router', version: '6.21.1' },
    { name: 'Lucide React', version: '0.303.0' }
  ];

  const requirements = {
    minimum: {
      processor: 'Intel Core i3 or equivalent',
      ram: '4 GB RAM',
      storage: '256 GB Storage',
      network: 'Broadband Internet connection',
      browser: 'Chrome 90+, Firefox 90+, Edge 90+',
      display: '1366 x 768 resolution'
    },
    recommended: {
      processor: 'Intel Core i5 or equivalent',
      ram: '8 GB RAM',
      storage: '512 GB SSD',
      network: 'High-speed Internet connection',
      browser: 'Latest version of Chrome, Firefox, or Edge',
      display: '1920 x 1080 resolution'
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-violet-800 mb-2">About System</h3>
        <p className="text-violet-600">Technical details and system requirements</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-violet-50 rounded-lg">
              <Code className="w-5 h-5 text-violet-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Technologies Used</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{tech.name}</p>
                <p className="text-sm text-violet-600">v{tech.version}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Minimum Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-violet-50 rounded-lg">
                <Server className="w-5 h-5 text-violet-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Minimum Requirements</h4>
            </div>
            <ul className="space-y-3">
              {Object.entries(requirements.minimum).map(([key, value]) => (
                <li key={key} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-violet-400 rounded-full mt-2"></span>
                  <div>
                    <span className="font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-violet-50 rounded-lg">
                <Monitor className="w-5 h-5 text-violet-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Recommended Requirements</h4>
            </div>
            <ul className="space-y-3">
              {Object.entries(requirements.recommended).map(([key, value]) => (
                <li key={key} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-violet-400 rounded-full mt-2"></span>
                  <div>
                    <span className="font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSystem;