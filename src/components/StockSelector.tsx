import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { StocksDict } from '../types';

interface StockSelectorProps {
  stocks: StocksDict;
  selectedStock: string;
  onSelectStock: (ticker: string) => void;
  loading: boolean;
  error: Error | null;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  stocks,
  selectedStock,
  onSelectStock,
  loading,
  error
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onSelectStock(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Loading stocks...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading stocks: {error.message}
      </Typography>
    );
  }

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="stock-selector-label">Select Stock</InputLabel>
      <Select
        labelId="stock-selector-label"
        id="stock-selector"
        value={selectedStock}
        onChange={handleChange}
        label="Select Stock"
      >
        {Object.entries(stocks).map(([name, ticker]) => (
          <MenuItem key={ticker} value={ticker}>
            {name} ({ticker})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StockSelector;