import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { StockPrice } from "../types";
import { calculateMean } from "../utils/statistics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockChartProps {
  ticker: string;
  data: StockPrice[];
  loading: boolean;
  error: Error | null;
}

const StockChart: React.FC<StockChartProps> = ({
  ticker,
  data,
  loading,
  error,
}) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.lastUpdatedAt).getTime() -
        new Date(b.lastUpdatedAt).getTime()
    );

    const labels = sortedData.map((item) => {
      const date = new Date(item.lastUpdatedAt);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    const prices = sortedData.map((item) => item.price);

    const averagePrice = calculateMean(prices);
    const averageLine = Array(prices.length).fill(averagePrice);

    return {
      labels,
      datasets: [
        {
          label: ticker,
          data: prices,
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: "Average",
          data: averageLine,
          borderColor: theme.palette.secondary.main,
          backgroundColor: "transparent",
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          tension: 0,
        },
      ],
    };
  }, [data, ticker, theme]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Price ($)",
        },
        ticks: {
          callback: function (value: any) {
            return "$" + value.toFixed(2);
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };

  if (loading) {
    return (
      <Card
        sx={{
          height: "400px",
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
      <Card sx={{ height: "400px", p: 3 }}>
        <Typography color="error" align="center">
          Error loading chart data: {error.message}
        </Typography>
      </Card>
    );
  }

  if (!chartData || data.length === 0) {
    return (
      <Card sx={{ height: "400px", p: 3 }}>
        <Typography align="center">No data available for {ticker}</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "400px", p: 2 }}>
      <CardContent sx={{ height: "100%" }}>
        <Box sx={{ height: "100%", position: "relative" }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StockChart;
