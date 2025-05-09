import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import axios from 'axios';

interface CalculatorResponse {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
}

const AverageCalculator: React.FC = () => {
  const [type, setType] = useState<string>('');
  const [response, setResponse] = useState<CalculatorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async (numberType: string) => {
    setType(numberType);
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:9876/numbers/${numberType}`);
      setResponse(response.data);
    } catch (err) {
      console.error(`Error fetching ${numberType} numbers:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };
  
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'p': return 'Prime';
      case 'f': return 'Fibonacci';
      case 'e': return 'Even';
      case 'r': return 'Random';
      default: return '';
    }
  };
  
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Average Calculator
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Choose a number type to calculate the average:
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item>
              <Button 
                variant={type === 'p' ? 'contained' : 'outlined'} 
                onClick={() => fetchData('p')}
                disabled={loading}
              >
                Prime Numbers
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={type === 'f' ? 'contained' : 'outlined'} 
                onClick={() => fetchData('f')}
                disabled={loading}
              >
                Fibonacci Numbers
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={type === 'e' ? 'contained' : 'outlined'} 
                onClick={() => fetchData('e')}
                disabled={loading}
              >
                Even Numbers
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant={type === 'r' ? 'contained' : 'outlined'} 
                onClick={() => fetchData('r')}
                disabled={loading}
              >
                Random Numbers
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ my: 2 }}>
            Error: {error.message}
          </Typography>
        ) : response ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Results for {getTypeLabel(type)} Numbers
            </Typography>
            
            <Paper sx={{ mb: 3 }}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '4px 4px 0 0' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Average: {response.avg.toFixed(2)}
                </Typography>
              </Box>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Previous Window State</TableCell>
                      <TableCell>Current Window State</TableCell>
                      <TableCell>Numbers From API</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {response.windowPrevState.length > 0 
                          ? response.windowPrevState.join(', ') 
                          : 'Empty'}
                      </TableCell>
                      <TableCell>
                        {response.windowCurrState.join(', ')}
                      </TableCell>
                      <TableCell>
                        {response.numbers.join(', ')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default AverageCalculator;