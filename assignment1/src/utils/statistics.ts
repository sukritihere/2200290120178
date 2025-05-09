import { StockPrice } from '../types';

// Extract prices from stock data array
export const extractPrices = (data: StockPrice[]): number[] => {
  return data.map(item => item.price);
};

// Calculate mean of an array of numbers
export const calculateMean = (data: number[]): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

// Calculate standard deviation of an array of numbers
export const calculateStdDev = (data: number[], mean: number): number => {
  if (data.length <= 1) return 0;
  
  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (data.length - 1);
  
  return Math.sqrt(variance);
};

// Calculate covariance between two arrays of numbers
export const calculateCovariance = (
  data1: number[],
  data2: number[],
  mean1: number,
  mean2: number
): number => {
  if (data1.length <= 1 || data1.length !== data2.length) return 0;
  
  let covariance = 0;
  for (let i = 0; i < data1.length; i++) {
    covariance += (data1[i] - mean1) * (data2[i] - mean2);
  }
  
  return covariance / (data1.length - 1);
};

// Calculate Pearson correlation coefficient between two arrays of numbers
export const calculateCorrelation = (
  data1: number[],
  data2: number[]
): number => {
  if (data1.length <= 1 || data1.length !== data2.length) return 0;
  
  const mean1 = calculateMean(data1);
  const mean2 = calculateMean(data2);
  const stdDev1 = calculateStdDev(data1, mean1);
  const stdDev2 = calculateStdDev(data2, mean2);
  
  // Handle case where standard deviation is zero
  if (stdDev1 === 0 || stdDev2 === 0) return 0;
  
  const covariance = calculateCovariance(data1, data2, mean1, mean2);
  
  return covariance / (stdDev1 * stdDev2);
};

// Calculate correlation matrix for multiple data series
export const calculateCorrelationMatrix = (
  dataDict: { [key: string]: number[] }
): { [key: string]: { [key: string]: number } } => {
  const tickers = Object.keys(dataDict);
  const matrix: { [key: string]: { [key: string]: number } } = {};
  
  tickers.forEach(ticker1 => {
    matrix[ticker1] = {};
    
    tickers.forEach(ticker2 => {
      if (ticker1 === ticker2) {
        matrix[ticker1][ticker2] = 1; // Self correlation is always 1
      } else {
        const correlation = calculateCorrelation(
          dataDict[ticker1],
          dataDict[ticker2]
        );
        matrix[ticker1][ticker2] = correlation;
      }
    });
  });
  
  return matrix;
};

// Align time series data
export const alignTimeSeriesData = (
  stocksData: { [key: string]: StockPrice[] }
): { [key: string]: number[] } => {
  const tickers = Object.keys(stocksData);
  const alignedData: { [key: string]: number[] } = {};
  
  // Initialize aligned data with empty arrays
  tickers.forEach(ticker => {
    alignedData[ticker] = [];
  });
  
  // Find common timestamps
  const allTimestamps = new Set<string>();
  tickers.forEach(ticker => {
    stocksData[ticker].forEach(dataPoint => {
      allTimestamps.add(dataPoint.lastUpdatedAt);
    });
  });
  
  // Convert to array and sort
  const sortedTimestamps = Array.from(allTimestamps).sort();
  
  // Create lookup maps for quick price access
  const priceMaps: { [key: string]: { [key: string]: number } } = {};
  tickers.forEach(ticker => {
    priceMaps[ticker] = {};
    stocksData[ticker].forEach(dataPoint => {
      priceMaps[ticker][dataPoint.lastUpdatedAt] = dataPoint.price;
    });
  });
  
  // Fill in the aligned data
  sortedTimestamps.forEach(timestamp => {
    tickers.forEach(ticker => {
      if (priceMaps[ticker][timestamp] !== undefined) {
        alignedData[ticker].push(priceMaps[ticker][timestamp]);
      }
    });
  });
  
  return alignedData;
};