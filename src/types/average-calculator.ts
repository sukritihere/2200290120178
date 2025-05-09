// Average Calculator Types
export interface NumberResponse {
  numbers: number[];
}

export interface CalculatorResponse {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
}