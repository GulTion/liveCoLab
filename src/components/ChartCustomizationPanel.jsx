import React, { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Function to generate column letters (A, B, C, ... AA, AB, etc.)
const getColumnLetters = (numCols) =>
  Array.from({ length: numCols }, (_, i) => {
    let colName = '';
    let dividend = i + 1;
    while (dividend > 0) {
      const modulo = (dividend - 1) % 26;
      colName = String.fromCharCode(65 + modulo) + colName;
      dividend = Math.floor((dividend - modulo) / 26);
    }
    return colName;
  });

// Available chart types
const chartTypes = [
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
  { value: 'scatter', label: 'Scatter' },
  // Add more chart types here
];

// --- Reusable Components ---

// Accordion for Chart Options
const ChartOptionAccordion = ({ title, children, expanded, onChange }) => (
  <Accordion expanded={expanded} onChange={onChange}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

// --- Main Component ---

const ChartCustomizationPanel = ({
  chartOptions,
  onOptionChange,
  spreadsheetData,
}) => {
  // State for chart options using default values
  const [options, setOptions] = useState({
    ...chartOptions,
    labelColumn: 'A', // Common label column
    charts: [
      {
        chartType: 'line',
        valueColumn: 'B',
        color: '#1f78b4', // Default color
      },
    ], // Initial chart
  });

  // Memoized column letters
  const columnLetters = useMemo(
    () => getColumnLetters(spreadsheetData[0]?.length || 0),
    [spreadsheetData]
  );

  // Handle option changes (only for labelColumn for now)
  const handleOptionChange = (optionName, value) => {
    const updatedOptions = { ...options, [optionName]: value };
    setOptions(updatedOptions);
    onOptionChange(updatedOptions);
  };

  // Handle changes for individual charts
  const handleChartChange = (index, field, value) => {
    const updatedCharts = [...options.charts];
    updatedCharts[index][field] = value;
    handleOptionChange('charts', updatedCharts);
  };

  // Add a new chart
  const handleAddChart = () => {
    const newChart = {
      chartType: 'line', // Default chart type
      valueColumn: 'B', // Default value column
      color: '#33a02c', // Default color for the new chart
    };
    handleOptionChange('charts', [...options.charts, newChart]);
  };

  // Remove a chart
  const handleRemoveChart = (index) => {
    const updatedCharts = options.charts.filter((_, i) => i !== index);
    handleOptionChange('charts', updatedCharts);
  };

  // --- Render ---

  return (
    <Box sx={{ p: 2 }}>
      {/* Data Selection Panel */}
      <ChartOptionAccordion title="Data" defaultExpanded>
        <Box sx={{ width: '100%' }}>
          {/* Common Label Column Selection */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="label-column-label">Label Column (Common)</InputLabel>
            <Select
              labelId="label-column-label"
              id="label-column"
              value={options.labelColumn}
              label="Label Column (Common)"
              onChange={(e) => handleOptionChange('labelColumn', e.target.value)}
            >
              {columnLetters.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Charts Configuration */}
          {options.charts.map((chart, index) => (
            <Box key={index} sx={{ border: '1px solid grey', p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ mr: 2 }}>
                  Chart {index + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveChart(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {/* Chart Type */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id={`chart-type-label-${index}`}>
                  Chart Type
                </InputLabel>
                <Select
                  labelId={`chart-type-label-${index}`}
                  id={`chart-type-${index}`}
                  value={chart.chartType}
                  label="Chart Type"
                  onChange={(e) =>
                    handleChartChange(index, 'chartType', e.target.value)
                  }
                >
                  {chartTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Value Column */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id={`value-column-label-${index}`}>
                  Value Column
                </InputLabel>
                <Select
                  labelId={`value-column-label-${index}`}
                  id={`value-column-${index}`}
                  value={chart.valueColumn}
                  label="Value Column"
                  onChange={(e) =>
                    handleChartChange(index, 'valueColumn', e.target.value)
                  }
                >
                  {columnLetters.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Color Picker */}
              <TextField
                label="Color"
                type="color"
                value={chart.color}
                onChange={(e) =>
                  handleChartChange(index, 'color', e.target.value)
                }
                size="small"
                sx={{ mb: 2 }}
              />
            </Box>
          ))}

          {/* Add Chart Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddChart}
          >
            Add New Chart
          </Button>
        </Box>
      </ChartOptionAccordion>
    </Box>
  );
};

export default ChartCustomizationPanel;