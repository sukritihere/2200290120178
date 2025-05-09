import axios from "axios";

const API_BASE_URL = "http://20.244.56.144/evaluation-service";

const API_ENDPOINTS = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand",
};

/**
 * Fetches numbers from third-party API with timeout handling
 * @param {string} numberType - Type of numbers to fetch (p, f, e, r)
 * @returns {Promise<number[]>} - Array of numbers
 */
export const fetchNumbers = async (numberType) => {
  try {
    const endpoint = API_ENDPOINTS[numberType];
    if (!endpoint) {
      throw new Error(`Invalid number type: ${numberType}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      signal: controller.signal,
      timeout: 500,
    });

    clearTimeout(timeoutId);

    if (response.data && Array.isArray(response.data.numbers)) {
      return response.data.numbers;
    }

    throw new Error("Invalid response format from third-party API");
  } catch (error) {
    if (error.name === "AbortError" || error.code === "ECONNABORTED") {
      console.error("Request timed out");
      return [];
    }
    console.error("Error fetching numbers:", error.message);
    throw error;
  }
};

/**
 * Calculates the average of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} - Average value
 */
export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) {
    return 0;
  }

  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
};
