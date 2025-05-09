import { useState, useEffect, useCallback } from 'react';
import { getStocks, getStockData } from '../services/api';
import { StocksDict, StockPrice, StockData } from '../types';

// Hook for fetching all available stocks
export const useStocks = () => {
  const [stocks, setStocks] = useState<StocksDict>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const stocksData = await getStocks();
        setStocks(stocksData);
        setError(null);
      } catch (err) {
        console.error("Error fetching stocks:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  return { stocks, loading, error };
};

// Hook for fetching single stock data with auto-refresh
export const useStockData = (ticker: string, minutes?: number, refreshInterval: number = 0) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStockData = useCallback(async () => {
    if (!ticker) return;
    
    try {
      setLoading(true);
      const data = await getStockData(ticker, minutes);
      setStockData(data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${ticker} data:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [ticker, minutes]);

  useEffect(() => {
    fetchStockData();
    
    // Set up interval for refreshing data if needed
    let intervalId: NodeJS.Timeout | undefined;
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchStockData, refreshInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchStockData, refreshInterval]);

  return { stockData, loading, error, refetch: fetchStockData };
};

// Hook for fetching multiple stock data history
export const useStockHistory = (ticker: string, minutes: number = 60) => {
  const [history, setHistory] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!ticker) return;
    
    try {
      setLoading(true);
      const data = await getStockData(ticker, minutes);
      // Handle both array response (history) and object response (current)
      if (Array.isArray(data)) {
        setHistory(data);
      } else if (data.stock) {
        setHistory([data.stock]);
      }
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${ticker} history:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [ticker, minutes]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
};