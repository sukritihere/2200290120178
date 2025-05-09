import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart, TrendingUp } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUp size={28} color={theme.palette.primary.main} strokeWidth={2} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              ml: 1,
              fontWeight: 700,
              color: theme.palette.primary.main,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            StockViz
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex' }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={!isMobile && <TrendingUp size={20} />}
            sx={{ 
              mr: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isMobile ? <TrendingUp size={20} /> : 'Stock Chart'}
          </Button>
          
          <Button
            component={RouterLink}
            to="/correlation"
            startIcon={!isMobile && <BarChart size={20} />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isMobile ? <BarChart size={20} /> : 'Correlation Map'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;