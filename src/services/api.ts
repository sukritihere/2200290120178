import axios from "axios";

const baseURL = "http://20.244.56.144/evaluation-service";
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2ODAwODQ4LCJpYXQiOjE3NDY4MDA1NDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjhjNDJjMzEwLWZiMzQtNDYxMy1hNTMyLWU1ZjkyOTFjYTUzOCIsInN1YiI6InN1a3JpdGkuMjIyNmNzMTEwNUBraWV0LmVkdSJ9LCJlbWFpbCI6InN1a3JpdGkuMjIyNmNzMTEwNUBraWV0LmVkdSIsIm5hbWUiOiJzdWtyaXRpIHNpbmdoIiwicm9sbE5vIjoiMjIwMDI5MDEyMDE3OCIsImFjY2Vzc0NvZGUiOiJTeFZlamEiLCJjbGllbnRJRCI6IjhjNDJjMzEwLWZiMzQtNDYxMy1hNTMyLWU1ZjkyOTFjYTUzOCIsImNsaWVudFNlY3JldCI6InZxekhaRlhUdWhUTUNOdWUifQ.MAl_pm82kJUYgVRlk-0tzRjPAPNxBHJL27E7xJrJAcM";
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const getStocks = async () => {
  try {
    const response = await api.get("/stocks");
    return response.data.stocks;
  } catch (error) {
    console.error("Get stocks error:", error);
    throw error;
  }
};

export const getStockData = async (ticker: string, minutes?: number) => {
  try {
    const url = minutes
      ? `/stocks/${ticker}?minutes=${minutes}`
      : `/stocks/${ticker}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`Get stock data error for ${ticker}:`, error);
    throw error;
  }
};

export default api;
