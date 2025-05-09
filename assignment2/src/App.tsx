import React, { useState, useEffect } from "react";
import { RefreshCw, BarChart2, AlertCircle } from "lucide-react";
import APITester from "./components/APITester";
import ResultDisplay from "./components/ResultDisplay";
import { ApiResponse } from "./types";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [serverStatus, setServerStatus] = useState<"up" | "down" | "checking">(
    "checking"
  );

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch("http://localhost:9876/health");
        if (response.ok) {
          setServerStatus("up");
        } else {
          setServerStatus("down");
        }
      } catch (err) {
        setServerStatus("down");
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleApiCall = async (numberType: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:9876/numbers/${numberType}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart2 className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">
                Average Calculator Microservice
              </h1>
            </div>
            <div className="flex items-center">
              <span className="mr-2">Server Status:</span>
              {serverStatus === "checking" && (
                <span className="flex items-center text-yellow-200">
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Checking...
                </span>
              )}
              {serverStatus === "up" && (
                <span className="flex items-center text-green-200">
                  <span className="h-3 w-3 rounded-full bg-green-400 mr-1"></span>
                  Online
                </span>
              )}
              {serverStatus === "down" && (
                <span className="flex items-center text-red-200">
                  <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {serverStatus === "down" && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>
              Server is not running. Please start the server with{" "}
              <code className="bg-red-50 px-2 py-1 rounded font-mono">
                npm run server
              </code>{" "}
              in your terminal.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <APITester onApiCall={handleApiCall} loading={loading} />
          <ResultDisplay
            response={apiResponse}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>
            Average Calculator Microservice &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
