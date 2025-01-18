import React, { useState } from "react";

// MUI imports
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import Spreadsheet from "./components/Spreadsheet";
import ChartDisplay from "./components/ChartDisplay";
import ChartCustomizationPanel from "./components/ChartCustomizationPanel";

// Create a theme instance.
const theme = createTheme();

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [spreadsheetData, setSpreadsheetData] = useState([
    ["10", "5", "8", "12"],
    ["3", "7", "6", "9"],
    ["15", "11", "9", "7"],
  ]);

  // Chart Customization State
  const [chartOptions, setChartOptions] = useState({
    theme: "Flourish: Apex",
    axisType: "Single",
    numberOfComboLines: 1,
    gridMode: "Single chart",
    heightMode: "Auto",
    aspectDesktop: 1,
    aspectMobile: 1,
    breakpoint: 500,
    labelColumn: "A", // Common label column
    charts: [
      {
        chartType: "line",
        valueColumn: "B",
        color: "#1f78b4", // Default color
      },
    ], // Initial chart
  });

  const [value, setValue] = useState(0); // State to track the selected tab

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSpreadsheetDataChange = (newData) => {
    setSpreadsheetData(newData);
  };

  const handleChartOptionChange = (newOptions) => {
    console.log("newOptions", newOptions);
    setChartOptions(newOptions);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Spreadsheet and Chart
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Spreadsheet" />
            <Tab label="Chart & Options" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <TabPanel value={value} index={0}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Spreadsheet
              spreadsheetData={spreadsheetData}
              onDataChange={handleSpreadsheetDataChange}
            />
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}> {/* Chart on the left */}
              <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <ChartDisplay
                  data={spreadsheetData}
                  options={chartOptions}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}> {/* Chart Options on the right */}
              <Paper elevation={3} sx={{ p: 2 }}>
                <ChartCustomizationPanel
                  chartOptions={chartOptions}
                  onOptionChange={handleChartOptionChange}
                  spreadsheetData={spreadsheetData}
                />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

export default App;