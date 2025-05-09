import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useTheme,
  Tooltip,
} from "@mui/material";
import { CorrelationMatrix, StockStats } from "../types";

interface CorrelationHeatmapProps {
  correlationMatrix: CorrelationMatrix;
  stockStats: StockStats[];
  loading: boolean;
  error: Error | null;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  correlationMatrix,
  stockStats,
  loading,
  error,
}) => {
  const theme = useTheme();

  const getCorrelationColor = (value: number): string => {
    if (value >= 0.8) return "#1a7f37";
    if (value >= 0.5) return "#2da44e";
    if (value >= 0.3) return "#4ac26b";
    if (value >= 0) return "#b1f2c0";
    if (value >= -0.3) return "#ffdfb6";
    if (value >= -0.5) return "#f7b955";
    if (value >= -0.8) return "#e16f24";
    return "#d73a49";
  };

  const tickers = useMemo(() => {
    return Object.keys(correlationMatrix);
  }, [correlationMatrix]);

  const getStockStat = (ticker: string): StockStats | undefined => {
    return stockStats.find((stat) => stat.ticker === ticker);
  };

  if (loading) {
    return (
      <Card
        sx={{
          height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: "600px", p: 3 }}>
        <Typography color="error" align="center">
          Error loading correlation data: {error.message}
        </Typography>
      </Card>
    );
  }

  if (tickers.length === 0) {
    return (
      <Card sx={{ height: "600px", p: 3 }}>
        <Typography align="center">No correlation data available</Typography>
      </Card>
    );
  }

  const cellSize = `${Math.min(40, 600 / tickers.length)}px`;

  return (
    <Card sx={{ p: 2, overflowX: "auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Stock Price Correlation Heatmap
        </Typography>

        <Box sx={{ display: "flex", mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mr: 2 }}>
            Correlation Strength:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {[
              { value: "-1.0", color: "#d73a49", label: "Strong negative" },
              { value: "-0.5", color: "#e16f24", label: "Moderate negative" },
              { value: "0", color: "#ffdfb6", label: "No correlation" },
              { value: "0.5", color: "#2da44e", label: "Moderate positive" },
              { value: "1.0", color: "#1a7f37", label: "Strong positive" },
            ].map((item, index) => (
              <Tooltip key={index} title={item.label}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mr: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: item.color,
                      borderRadius: "2px",
                    }}
                  />
                  <Typography variant="caption">{item.value}</Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex" }}>
          {/* Empty corner cell */}
          <Box
            sx={{
              width: cellSize,
              height: cellSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              border: `1px solid ${theme.palette.divider}`,
            }}
          />

          {/* Column headers */}
          {tickers.map((ticker) => (
            <Tooltip
              key={`col-${ticker}`}
              title={
                getStockStat(ticker)
                  ? `Avg: $${getStockStat(ticker)!.mean.toFixed(
                      2
                    )}, StdDev: $${getStockStat(ticker)!.stdDev.toFixed(2)}`
                  : ""
              }
            >
              <Box
                sx={{
                  width: cellSize,
                  height: cellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {ticker}
              </Box>
            </Tooltip>
          ))}
        </Box>

        {/* Rows */}
        {tickers.map((ticker1) => (
          <Box key={`row-${ticker1}`} sx={{ display: "flex" }}>
            {/* Row header */}
            <Tooltip
              title={
                getStockStat(ticker1)
                  ? `Avg: $${getStockStat(ticker1)!.mean.toFixed(
                      2
                    )}, StdDev: $${getStockStat(ticker1)!.stdDev.toFixed(2)}`
                  : ""
              }
            >
              <Box
                sx={{
                  width: cellSize,
                  height: cellSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  backgroundColor: theme.palette.grey[100],
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {ticker1}
              </Box>
            </Tooltip>

            {/* Correlation cells */}
            {tickers.map((ticker2) => {
              const value = correlationMatrix[ticker1][ticker2];

              return (
                <Tooltip
                  key={`cell-${ticker1}-${ticker2}`}
                  title={`${ticker1} to ${ticker2}: ${value.toFixed(2)}`}
                >
                  <Box
                    sx={{
                      width: cellSize,
                      height: cellSize,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: getCorrelationColor(value),
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: "0.75rem",
                    }}
                  >
                    {value.toFixed(2)}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
