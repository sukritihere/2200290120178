import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import StockChart from "../components/StockChart";
import StockSelector from "../components/StockSelector";
import TimeRangeSelector from "../components/TimeRangeSelector";
import { useStocks, useStockHistory, useStockData } from "../hooks/useStocks";
import {
  calculateMean,
  calculateStdDev,
  extractPrices,
} from "../utils/statistics";
import { TrendingUp, DollarSign, BarChart2 } from "lucide-react";

const StockPage: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<string>("NVDA");
  const [timeRange, setTimeRange] = useState<number>(60);

  const { stocks, loading: stocksLoading, error: stocksError } = useStocks();

  const {
    history,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useStockHistory(selectedStock, timeRange);

  const {
    stockData,
    loading: currentDataLoading,
    error: currentDataError,
    refetch: refetchCurrent,
  } = useStockData(selectedStock, undefined, 30000);

  const currentData = currentDataLoading ? null : stockData;
  const currentPrice = currentData?.stock?.price;

  const stats = React.useMemo(() => {
    if (!history || history.length === 0) return null;

    const prices = extractPrices(history);
    const mean = calculateMean(prices);
    const stdDev = calculateStdDev(prices, mean);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const latest =
      history[history.length - 1]?.price ||
      (currentDataLoading ? null : currentData?.stock?.price);

    return { mean, stdDev, min, max, latest };
  }, [history, currentDataLoading, currentData?.stock?.price]);

  const handleStockChange = (ticker: string) => {
    setSelectedStock(ticker);
  };

  const handleTimeRangeChange = (minutes: number) => {
    setTimeRange(minutes);
  };

  useEffect(() => {
    refetchHistory();
    refetchCurrent();
  }, [selectedStock, timeRange, refetchHistory, refetchCurrent]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Stock Price Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} md={4}>
          <StockSelector
            stocks={stocks}
            selectedStock={selectedStock}
            onSelectStock={handleStockChange}
            loading={stocksLoading}
            error={stocksError}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TimeRangeSelector
            selectedMinutes={timeRange}
            onSelectMinutes={handleTimeRangeChange}
          />
        </Grid>
      </Grid>

      {/* Current Price Card */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <DollarSign size={36} color="#1976d2" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Price
                  </Typography>
                  {currentDataLoading ? (
                    <Typography variant="h5">Loading...</Typography>
                  ) : currentDataError ? (
                    <Typography variant="body2" color="error">
                      Error loading data
                    </Typography>
                  ) : currentPrice ? (
                    <Typography variant="h5" fontWeight="bold">
                      ${currentPrice.toFixed(2)}
                    </Typography>
                  ) : (
                    <Typography variant="body2">No data available</Typography>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <TrendingUp size={36} color="#2e7d32" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Average Price
                  </Typography>
                  {historyLoading ? (
                    <Typography variant="h5">Loading...</Typography>
                  ) : historyError ? (
                    <Typography variant="body2" color="error">
                      Error loading data
                    </Typography>
                  ) : stats?.mean ? (
                    <Typography variant="h5" fontWeight="bold">
                      ${stats.mean.toFixed(2)}
                    </Typography>
                  ) : (
                    <Typography variant="body2">No data available</Typography>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <BarChart2 size={36} color="#ed6c02" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Volatility (StdDev)
                  </Typography>
                  {historyLoading ? (
                    <Typography variant="h5">Loading...</Typography>
                  ) : historyError ? (
                    <Typography variant="body2" color="error">
                      Error loading data
                    </Typography>
                  ) : stats?.stdDev ? (
                    <Typography variant="h5" fontWeight="bold">
                      ${stats.stdDev.toFixed(2)}
                    </Typography>
                  ) : (
                    <Typography variant="body2">No data available</Typography>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Price Range Card */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              divider={<Divider orientation="vertical" flexItem />}
              justifyContent="space-around"
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Min Price (Last {timeRange} min)
                </Typography>
                {historyLoading ? (
                  <Typography variant="h6">Loading...</Typography>
                ) : historyError ? (
                  <Typography variant="body2" color="error">
                    Error loading data
                  </Typography>
                ) : stats?.min ? (
                  <Typography variant="h6" fontWeight="medium">
                    ${stats.min.toFixed(2)}
                  </Typography>
                ) : (
                  <Typography variant="body2">No data available</Typography>
                )}
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Max Price (Last {timeRange} min)
                </Typography>
                {historyLoading ? (
                  <Typography variant="h6">Loading...</Typography>
                ) : historyError ? (
                  <Typography variant="body2" color="error">
                    Error loading data
                  </Typography>
                ) : stats?.max ? (
                  <Typography variant="h6" fontWeight="medium">
                    ${stats.max.toFixed(2)}
                  </Typography>
                ) : (
                  <Typography variant="body2">No data available</Typography>
                )}
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Price Range (Last {timeRange} min)
                </Typography>
                {historyLoading ? (
                  <Typography variant="h6">Loading...</Typography>
                ) : historyError ? (
                  <Typography variant="body2" color="error">
                    Error loading data
                  </Typography>
                ) : stats?.max && stats?.min ? (
                  <Typography variant="h6" fontWeight="medium">
                    ${(stats.max - stats.min).toFixed(2)}
                  </Typography>
                ) : (
                  <Typography variant="body2">No data available</Typography>
                )}
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Data Points
                </Typography>
                {historyLoading ? (
                  <Typography variant="h6">Loading...</Typography>
                ) : historyError ? (
                  <Typography variant="body2" color="error">
                    Error loading data
                  </Typography>
                ) : history ? (
                  <Typography variant="h6" fontWeight="medium">
                    {history.length}
                  </Typography>
                ) : (
                  <Typography variant="body2">No data available</Typography>
                )}
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <StockChart
            ticker={selectedStock}
            data={history}
            loading={historyLoading}
            error={historyError}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default StockPage;
