import React from "react";
import { Loader, Info } from "lucide-react";
import JSONPretty from "react-json-pretty";
import { ApiResponse } from "../types";

interface ResultDisplayProps {
  response: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  response,
  loading,
  error,
}) => {
  const jsonTheme = {
    main: "background:#f5f5f5;padding:0.5rem;border-radius:0.375rem;",
    key: "color:#8b5cf6;",
    string: "color:#10b981;",
    value: "color:#3b82f6;",
    punctuation: "color:#6b7280;",
  };

  const renderWindowState = (title: string, numbers: number[] | undefined) => {
    if (!numbers || numbers.length === 0) {
      return <div className="text-gray-500 italic">Empty</div>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {numbers.map((num, index) => (
          <span
            key={`${title}-${index}`}
            className="inline-flex items-center justify-center min-w-8 h-8 px-2 bg-gray-100 text-gray-800 rounded-md border border-gray-200 font-mono text-sm"
          >
            {num}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">API Response</h2>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-gray-600">Fetching data...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-4">
          <div className="flex">
            <Info className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && !response && (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center px-4">
            <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              No data yet. Click one of the number type buttons to make an API
              request.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && response && (
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-2">Window State</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500 mb-1">Previous State</h4>
                {renderWindowState("prev", response.windowPrevState)}
              </div>
              <div>
                <h4 className="text-sm text-gray-500 mb-1">Current State</h4>
                {renderWindowState("curr", response.windowCurrState)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium mb-2">Average</h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4 text-center">
              <span className="text-3xl font-bold text-indigo-600">
                {response.avg}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium mb-2">Raw Response</h3>
            <div className="overflow-auto max-h-64 font-mono text-sm">
              <JSONPretty id="json-pretty" data={response} theme={jsonTheme} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
