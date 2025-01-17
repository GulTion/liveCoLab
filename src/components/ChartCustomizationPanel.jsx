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
  ButtonGroup,
  Divider,
  Box,
  Tooltip,
  Chip,
  tooltipClasses,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/system';

// Styled tooltip - No changes needed
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

// --- Helper Functions and Constants ---

// Function to generate column letters (A, B, C, ...)
const getColumnLetters = (numCols) =>
  Array.from({ length: numCols }, (_, i) => String.fromCharCode(65 + i));

// Default chart options
const defaultChartOptions = {
  theme: 'Flourish: Apex',
  chartType: 'Combo: Lines & columns (stacked)',
  axisType: 'Single',
  numberOfComboLines: 1,
  gridMode: 'Auto',
  heightMode: 'Auto',
  aspectDesktop: 1,
  aspectMobile: 1,
  breakpoint: 500,
  labelColumn: 'A',
  valueColumns: ['B', 'C'],
};

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
    ...defaultChartOptions,
    ...chartOptions,
  });

  // Memoized column letters
  const columnLetters = useMemo(
    () => getColumnLetters(spreadsheetData[0]?.length || 0),
    [spreadsheetData]
  );

  // Handle option changes
  const handleOptionChange = (optionName, value) => {
    const updatedOptions = { ...options, [optionName]: value };
    setOptions(updatedOptions);
    onOptionChange(updatedOptions);
  };

  // Handle data selection changes (specific to labelColumn and valueColumns)
  const handleDataOptionChange = (optionName, value) => {
    handleOptionChange(optionName, value);
  };

  // Handle reset theme (specific to theme)
  const handleResetTheme = () => {
    handleOptionChange('theme', defaultChartOptions.theme);
  };

  // --- Render ---

  return (
    <Box sx={{ p: 2 }}>
      {/* Chart Options Panel */}
      <ChartOptionAccordion title="Chart Options" defaultExpanded>
        <Box sx={{ width: '100%' }}>
          {/* Theme Accordion */}
          <ChartOptionAccordion
            title="Theme"
            expanded={options.theme !== undefined}
            onChange={() => {}}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControl fullWidth size="small" sx={{ mr: 2 }}>
                <InputLabel id="theme-select-label">Theme</InputLabel>
                <Select
                  labelId="theme-select-label"
                  id="theme-select"
                  value={options.theme}
                  label="Theme"
                  onChange={(e) => handleOptionChange('theme', e.target.value)}
                >
                  <MenuItem value="Flourish: Apex">Flourish: Apex</MenuItem>
                  {/* Add more theme options here */}
                </Select>
              </FormControl>
              <LightTooltip title="Reset to default theme">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleResetTheme}
                >
                  <RefreshIcon />
                </Button>
              </LightTooltip>
            </Box>
          </ChartOptionAccordion>

          {/* Chart Type Accordion */}
          <ChartOptionAccordion
            title="Chart Type"
            expanded={options.chartType !== undefined}
            onChange={() => {}}
          >
            <FormControl fullWidth size="small">
              <InputLabel id="chart-type-label">Chart Type</InputLabel>
              <Select
                labelId="chart-type-label"
                id="chart-type"
                value={options.chartType}
                label="Chart Type"
                onChange={(e) =>
                  handleOptionChange('chartType', e.target.value)
                }
              >
                <MenuItem value="Combo: Lines & columns (stacked)">
                  Combo: Lines & columns (stacked)
                </MenuItem>
                {/* Add more chart types here */}
              </Select>
            </FormControl>
          </ChartOptionAccordion>

          {/* Axis Type, Number of Combo Lines */}
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1">Axis type</Typography>
            <ButtonGroup
              variant="outlined"
              size="small"
              aria-label="axis type button group"
            >
              <LightTooltip title="Single Axis">
                <Button
                  variant={
                    options.axisType === 'Single' ? 'contained' : 'outlined'
                  }
                  onClick={() => handleOptionChange('axisType', 'Single')}
                >
                  Single
                </Button>
              </LightTooltip>
              <LightTooltip title="Dual Axis">
                <Button
                  variant={
                    options.axisType === 'Dual' ? 'contained' : 'outlined'
                  }
                  onClick={() => handleOptionChange('axisType', 'Dual')}
                >
                  Dual
                </Button>
              </LightTooltip>
            </ButtonGroup>
            <TextField
              label="Number of combo lines"
              type="number"
              value={options.numberOfComboLines}
              onChange={(e) =>
                handleOptionChange('numberOfComboLines', e.target.value)
              }
              size="small"
              sx={{ width: 80 }}
            />
          </Box>

          {/* Grid Mode */}
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              my: 2,
            }}
          >
            <Typography variant="body1">Grid mode</Typography>
            <ButtonGroup
              variant="outlined"
              size="small"
              aria-label="grid mode button group"
            >
              <LightTooltip title="Single Chart">
                <Button
                  variant={
                    options.gridMode === 'Single chart'
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() => handleOptionChange('gridMode', 'Single chart')}
                >
                  Single chart
                </Button>
              </LightTooltip>
              <LightTooltip title="Grid of Charts">
                <Button
                  variant={
                    options.gridMode === 'Grid of charts'
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() =>
                    handleOptionChange('gridMode', 'Grid of charts')
                  }
                >
                  Grid of charts
                </Button>
              </LightTooltip>
            </ButtonGroup>
          </Box>

          {/* Height Mode */}
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              my: 2,
            }}
          >
            <Typography variant="body1">Height mode</Typography>
            <ButtonGroup
              variant="outlined"
              size="small"
              aria-label="height mode button group"
            >
              <LightTooltip title="Auto">
                <Button
                  variant={
                    options.heightMode === 'Auto' ? 'contained' : 'outlined'
                  }
                  onClick={() => handleOptionChange('heightMode', 'Auto')}
                >
                  Auto
                </Button>
              </LightTooltip>
              <LightTooltip title="Standard">
                <Button
                  variant={
                    options.heightMode === 'Standard' ? 'contained' : 'outlined'
                  }
                  onClick={() => handleOptionChange('heightMode', 'Standard')}
                >
                  Standard
                </Button>
              </LightTooltip>
              <LightTooltip title="Aspect Ratio">
                <Button
                  variant={
                    options.heightMode === 'Aspect ratio'
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() =>
                    handleOptionChange('heightMode', 'Aspect ratio')
                  }
                >
                  Aspect ratio
                </Button>
              </LightTooltip>
            </ButtonGroup>
          </Box>

          {/* Aspect Ratios and Breakpoint */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <TextField
              label="Aspect (desktop)"
              type="number"
              value={options.aspectDesktop}
              onChange={(e) =>
                handleOptionChange('aspectDesktop', e.target.value)
              }
              size="small"
              sx={{ width: 80, mr: 2 }}
            />
            <TextField
              label="Aspect (mobile)"
              type="number"
              value={options.aspectMobile}
              onChange={(e) =>
                handleOptionChange('aspectMobile', e.target.value)
              }
              size="small"
              sx={{ width: 80, mr: 2 }}
            />
            <TextField
              label="Breakpoint"
              type="number"
              value={options.breakpoint}
              onChange={(e) => handleOptionChange('breakpoint', e.target.value)}
              size="small"
              sx={{ width: 80 }}
            />
          </Box>

          {/* Other Accordions (Placeholders) */}
          <Divider sx={{ my: 2 }} />
          {[
            'Grid of charts',
            'Controls & filters',
            'Colors',
            'Lines, dots and areas',
            'Bars',
            'Labels',
            'X axis',
            'Y axis',
            'Y axis (right)',
            'Plot background',
            'Number formatting',
            'Legend',
            'Popups & panels',
          ].map((title) => (
            <ChartOptionAccordion key={title} title={title}>
              {/* Add content for these options here */}
            </ChartOptionAccordion>
          ))}
        </Box>
      </ChartOptionAccordion>

      {/* Data Selection Panel */}
      <ChartOptionAccordion title="Data" defaultExpanded>
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" gutterBottom>
            SELECT COLUMNS TO VISUALISE
            <Button size="small" sx={{ ml: 2 }}>
              Auto set columns
            </Button>
          </Typography>

          {/* Label Column Selection */}
          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel id="label-column-label">Labels/time</InputLabel>
            <Select
              labelId="label-column-label"
              id="label-column"
              value={options.labelColumn}
              label="Labels/time"
              onChange={(e) =>
                handleDataOptionChange('labelColumn', e.target.value)
              }
            >
              {columnLetters.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Value Columns Selection */}
          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel id="value-columns-label">Values</InputLabel>
            <Select
              labelId="value-columns-label"
              id="value-columns"
              multiple
              value={options.valueColumns}
              label="Values"
              onChange={(e) =>
                handleDataOptionChange('valueColumns', e.target.value)
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {columnLetters.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Add more data selection options here (Charts grid, Row filter, etc.) */}
        </Box>
      </ChartOptionAccordion>
    </Box>
  );
};

export default ChartCustomizationPanel;