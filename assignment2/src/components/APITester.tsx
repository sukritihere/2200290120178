import React from 'react';
import { LineChart, Hash, Sigma, Shuffle } from 'lucide-react';

interface APITesterProps {
  onApiCall: (numberType: string) => void;
  loading: boolean;
}

const APITester: React.FC<APITesterProps> = ({ onApiCall, loading }) => {
  const numberTypes = [
    { id: 'p', name: 'Prime', color: 'bg-red-500 hover:bg-red-600', icon: <LineChart className="h-5 w-5 mr-2" /> },
    { id: 'f', name: 'Fibonacci', color: 'bg-blue-500 hover:bg-blue-600', icon: <Sigma className="h-5 w-5 mr-2" /> },
    { id: 'e', name: 'Even', color: 'bg-green-500 hover:bg-green-600', icon: <Hash className="h-5 w-5 mr-2" /> },
    { id: 'r', name: 'Random', color: 'bg-purple-500 hover:bg-purple-600', icon: <Shuffle className="h-5 w-5 mr-2" /> }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">API Tester</h2>
      <p className="text-gray-600 mb-4">
        Click on a button below to fetch numbers from the third-party API and calculate their average.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="text-md font-medium mb-2">Endpoint Pattern</h3>
        <code className="block bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
          GET http://localhost:9876/numbers/{'{numberid}'}
        </code>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Select Number Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {numberTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onApiCall(type.id)}
              disabled={loading}
              className={`${type.color} text-white py-3 px-4 rounded-md flex items-center justify-center transition-transform transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type.color.split('-')[1]}-400 disabled:opacity-50`}
            >
              {type.icon}
              <span>{type.name} Numbers</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium mb-2">Configuration</h3>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Window Size:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">10</span>
        </div>
      </div>
    </div>
  );
};

export default APITester;