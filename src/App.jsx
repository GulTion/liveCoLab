import React, { useState } from 'react';

// MUI imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Spreadsheet from './components/Spreadsheet';
import ChartDisplay from './components/ChartDisplay';
import ChartCustomizationPanel from './components/ChartCustomizationPanel';


// Create a theme instance.
const theme = createTheme();

function App() {
  const [spreadsheetData, setSpreadsheetData] = useState([
    ['10', '5', '8', '12'],
    ['3', '7', '6', '9'],
    ['15', '11', '9', '7'],
  ]);

  // Chart Customization State
  const [chartOptions, setChartOptions] = useState({
    theme: 'Flourish: Apex',
    axisType: 'Single',
    numberOfComboLines: 1,
    gridMode: 'Single chart',
    heightMode: 'Auto',
    aspectDesktop: 1,
    aspectMobile: 1,
    breakpoint: 500,
    labelColumn: 'A', // Common label column
    charts: [
      {
        chartType: 'line',
        valueColumn: 'B',
        color: '#1f78b4', // Default color
      },
    ], // Initial chart
  });

  const handleSpreadsheetDataChange = (newData) => {
    setSpreadsheetData(newData);
  };

  const handleChartOptionChange = (newOptions) => {
    console.log("newOptions",newOptions);
    setChartOptions(newOptions);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Spreadsheet and Chart
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Spreadsheet taking the left half */}
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Spreadsheet onDataChange={handleSpreadsheetDataChange} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Chart taking the right half */}
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <ChartDisplay data={spreadsheetData} options={chartOptions} />
            </Paper>
            {/* Chart Customization Panel below the Chart */}
            <Paper elevation={3} sx={{ p: 2 }}>
              <ChartCustomizationPanel
                chartOptions={chartOptions}
                onOptionChange={handleChartOptionChange}
                spreadsheetData={spreadsheetData}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;