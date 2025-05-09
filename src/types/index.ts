// Stock data types
export interface StockPrice {
  price: number;
  lastUpdatedAt: string;
}

export interface StockData {
  stock?: StockPrice;
  [key: string]: any;
}

export interface StockHistoryData {
  [key: string]: StockPrice[];
}

export interface StocksDict {
  [key: string]: string;
}

// Correlation related types
export interface CorrelationData {
  ticker1: string;
  ticker2: string;
  correlation: number;
}

export interface CorrelationMatrix {
  [key: string]: {
    [key: string]: number;
  };
}

export interface StockStats {
  ticker: string;
  mean: number;
  stdDev: number;
}

// Auth types
export interface RegisterData {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  collegeName: string;
  accessCode: string;
}

export interface AuthData {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}