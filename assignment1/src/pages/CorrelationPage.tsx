import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Slider,
  InputLabel,
} from "@mui/material";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import TimeRangeSelector from "../components/TimeRangeSelector";
import { useStocks } from "../hooks/useStocks";
import { getStockData } from "../services/api";
import {
  StockPrice,
  StockHistoryData,
  CorrelationMatrix,
  StockStats,
} from "../types";
import {
  calculateCorrelationMatrix,
  calculateMean,
  calculateStdDev,
  extractPrices,
  alignTimeSeriesData,
} from "../utils/statistics";

const CorrelationPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<number>(60);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [maxStocks, setMaxStocks] = useState<number>(10);

  const [stocksHistory, setStocksHistory] = useState<StockHistoryData>({});
  const [correlationMatrix, setCorrelationMatrix] = useState<CorrelationMatrix>(
    {}
  );
  const [stockStats, setStockStats] = useState<StockStats[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { stocks, loading: stocksLoading, error: stocksError } = useStocks();

  const handleTimeRangeChange = (minutes: number) => {
    setTimeRange(minutes);
  };

  const handleStockSelectionChange = (ticker: string, checked: boolean) => {
    if (checked) {
      if (selectedStocks.length < maxStocks) {
        setSelectedStocks((prev) => [...prev, ticker]);
      }
    } else {
      setSelectedStocks((prev) => prev.filter((t) => t !== ticker));
    }
  };

  // Fetch historical data for selected stocks
  const fetchStocksData = useCallback(async () => {
    if (selectedStocks.length === 0) return;

    try {
      setLoading(true);
      const promises = selectedStocks.map((ticker) =>
        getStockData(ticker, timeRange)
          .then((data) => {
            // Convert to array if it's a single object
            if (!Array.isArray(data)) {
              return data.stock ? [data.stock] : [];
            }
            return data;
          })
          .catch((err) => {
            console.error(`Error fetching ${ticker} data:`, err);
            return [];
          })
      );

      const results = await Promise.all(promises);

      // Create a map of ticker to history data
      const historyData: StockHistoryData = {};
      selectedStocks.forEach((ticker, index) => {
        historyData[ticker] = results[index];
      });

      setStocksHistory(historyData);
      setError(null);
    } catch (err) {
      console.error("Error fetching stocks data:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [selectedStocks, timeRange]);

  // Calculate correlation matrix when data changes
  useEffect(() => {
    if (Object.keys(stocksHistory).length === 0) return;

    // Align time series data
    const alignedData = alignTimeSeriesData(stocksHistory);

    // Calculate correlation matrix
    const matrix = calculateCorrelationMatrix(alignedData);
    setCorrelationMatrix(matrix);

    // Calculate statistics for each stock
    const stats: StockStats[] = Object.keys(alignedData).map((ticker) => {
      const prices = alignedData[ticker];
      const mean = calculateMean(prices);
      const stdDev = calculateStdDev(prices, mean);

      return { ticker, mean, stdDev };
    });

    setStockStats(stats);
  }, [stocksHistory]);

  // Fetch data when selections change
  useEffect(() => {
    fetchStocksData();
  }, [fetchStocksData]);

  // Initialize with a few default stocks when stocks are loaded
  useEffect(() => {
    if (
      !stocksLoading &&
      Object.keys(stocks).length > 0 &&
      selectedStocks.length === 0
    ) {
      // Get the first few stock tickers
      const defaultStocks = Object.values(stocks).slice(0, 5);
      setSelectedStocks(defaultStocks);
    }
  }, [stocks, stocksLoading, selectedStocks.length]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Stock Correlation Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Time range selector */}
        <Grid item xs={12} md={4}>
          <TimeRangeSelector
            selectedMinutes={timeRange}
            onSelectMinutes={handleTimeRangeChange}
          />
        </Grid>

        {/* Max stocks slider */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <InputLabel id="max-stocks-slider-label">
                Maximum Stocks to Compare: {maxStocks}
              </InputLabel>
              <Slider
                aria-labelledby="max-stocks-slider-label"
                value={maxStocks}
                onChange={(_, value) => setMaxStocks(value as number)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={2}
                max={20}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Stock selection */}
        <Grid item xs={12} md={4}>
          <Card sx={{ maxHeight: "600px", overflow: "auto" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Stocks to Compare
              </Typography>

              {stocksLoading ? (
                <Typography>Loading stocks...</Typography>
              ) : stocksError ? (
                <Typography color="error">
                  Error loading stocks: {stocksError.message}
                </Typography>
              ) : (
                <FormGroup>
                  {Object.entries(stocks).map(([name, ticker]) => (
                    <FormControlLabel
                      key={ticker}
                      control={
                        <Checkbox
                          checked={selectedStocks.includes(ticker)}
                          onChange={(e, checked) =>
                            handleStockSelectionChange(ticker, checked)
                          }
                          disabled={
                            !selectedStocks.includes(ticker) &&
                            selectedStocks.length >= maxStocks
                          }
                        />
                      }
                      label={`${name} (${ticker})`}
                    />
                  ))}
                </FormGroup>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Correlation heatmap */}
        <Grid item xs={12} md={8}>
          <Box sx={{ height: "100%" }}>
            <CorrelationHeatmap
              correlationMatrix={correlationMatrix}
              stockStats={stockStats}
              loading={loading || stocksLoading}
              error={error || stocksError}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Stats table */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Statistics (Last {timeRange} minutes)
              </Typography>

              {loading ? (
                <Typography>Loading statistics...</Typography>
              ) : error ? (
                <Typography color="error">
                  Error loading statistics: {error.message}
                </Typography>
              ) : stockStats.length === 0 ? (
                <Typography>
                  No statistics available. Please select stocks to compare.
                </Typography>
              ) : (
                <Box sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Stock
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Average Price
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Standard Deviation
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          Data Points
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockStats.map((stat) => (
                        <tr key={stat.ticker}>
                          <td
                            style={{
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {stat.ticker}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            ${stat.mean.toFixed(2)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            ${stat.stdDev.toFixed(2)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {stocksHistory[stat.ticker]?.length || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CorrelationPage;
