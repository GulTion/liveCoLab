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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import Spreadsheet from "./components/Spreadsheet";
import ChartDisplay from "./components/ChartDisplay";
import ChartCustomizationPanel from "./components/ChartCustomizationPanel";
// import { useNavigate, useParams } from "react-router-dom";
// import { Socket } from "socket.io-client";

import "./utils/socket";
document.livecolab.init();

/* -----------------------------------------------
   1) ConnectedUsers COMPONENT
------------------------------------------------ */
function ConnectedUsers({ users }) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f3f3f3",
        minWidth: "200px",
        height: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Connected Users
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {users.map((u, i) => (
        <Box key={i} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {u.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Role: {u.role || "N/A"}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

/* -----------------------------------------------
   2) Chat COMPONENT
   Now we'll place it in the Chart & Options tab.
------------------------------------------------ */
function Chat() {
  const [messages, setMessages] = useState([
    { text: "Welcome to the chat!", sender: "System" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    // Add to local state
    setMessages((prev) => [...prev, { text: inputValue.trim(), sender: "You" }]);
    setInputValue("");
    // In a real app, you'd emit to a server via Socket.IO, etc.
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Room Chat
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Messages list */}
      <Box
        sx={{
          maxHeight: 200,
          overflowY: "auto",
          mb: 2,
          p: 1,
          border: "1px solid #ccc",
          borderRadius: 1,
          backgroundColor: "#fafafa",
        }}
      >
        <List dense>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {msg.sender}
                  </Typography>
                }
                secondary={msg.text}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Input + Send */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Paper>
  );
}

/* -----------------------------------------------
   3) THEME: Slight Customization
------------------------------------------------ */
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

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
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

/* -----------------------------------------------
   4) MAIN APP
------------------------------------------------ */
export default function App() {
  // Spreadsheet Data
  const [spreadsheetData, setSpreadsheetData] = useState([
    ["10", "5", "8", "12"],
    ["3", "7", "6", "9"],
    ["15", "11", "9", "7"],
  ]);

  // Mock connected users
  const [connectedUsers, setConnectedUsers] = useState([
    { username: "Alice", role: "Admin" },
    { username: "Bob", role: "Viewer" },
  ]);

  // Link to `setSpreadsheetData` in livecolab
  document.livecolab.setSpreadsheetData = setSpreadsheetData;

  // Chart Customization
  const [chartOptions, setChartOptions] = useState({
    theme: "Flourish: Apex",
    axisType: "Single",
    numberOfComboLines: 1,
    gridMode: "Single chart",
    heightMode: "Auto",
    aspectDesktop: 1,
    aspectMobile: 1,
    breakpoint: 500,
    labelColumn: "A",
    charts: [
      {
        chartType: "line",
        valueColumn: "B",
        color: "#1f78b4",
      },
    ],
  });

  // Track active tab
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Spreadsheet callback
  const handleSpreadsheetDataChange = (newData) => {
    setSpreadsheetData(newData);
  };

  // Chart Options callback
  const handleChartOptionChange = (newOptions) => {
    console.log("newOptions", newOptions);
    setChartOptions(newOptions);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* HEADER / NAVBAR */}
      <AppBar position="static" sx={{ mb: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Spreadsheet and Chart
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Spreadsheet" />
            <Tab label="Chart & Options" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* MAIN LAYOUT: left users, right tabs */}
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        {/* Left side: Connected Users */}
        <Box sx={{ p: 2, borderRight: "1px solid #eee" }}>
          <ConnectedUsers users={connectedUsers} />
        </Box>

        {/* Right side: Tab Panels */}
        <Box sx={{ flexGrow: 1 }}>
          <Container maxWidth="lg" sx={{ mt: 3 }}>
            {/* TAB #0: SPREADSHEET */}
            <TabPanel value={value} index={0}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Spreadsheet
                  spreadsheetData={spreadsheetData}
                  onDataChange={handleSpreadsheetDataChange}
                />
              </Paper>
            </TabPanel>

            {/* TAB #1: CHART & OPTIONS + Chat at bottom */}
            <TabPanel value={value} index={1}>
              {/* Chart area */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                    <ChartDisplay data={spreadsheetData} options={chartOptions} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <ChartCustomizationPanel
                      chartOptions={chartOptions}
                      onOptionChange={handleChartOptionChange}
                      spreadsheetData={spreadsheetData}
                    />
                  </Paper>
                </Grid>
              </Grid>

              {/* Chat below the chart & options */}
              <Chat />
            </TabPanel>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
