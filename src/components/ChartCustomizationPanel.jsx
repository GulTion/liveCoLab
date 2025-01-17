import React, { useState } from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/system";

// Styled tooltip
const LightTooltip = styled(({ className, ...props }) => (
<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
[`& .${tooltipClasses.tooltip}`]: {
backgroundColor: theme.palette.common.white,
color: "rgba(0, 0, 0, 0.87)",
boxShadow: theme.shadows[1],
fontSize: 11,
},
}));

const ChartCustomizationPanel = ({
chartOptions,
onOptionChange,
spreadsheetData,
}) => {
// State for chart options (using your provided image as a guide)
const [theme, setTheme] = useState(chartOptions.theme || "Flourish: Apex");
const [chartType, setChartType] = useState(
chartOptions.chartType || "Combo: Lines & columns (stacked)"
);
const [axisType, setAxisType] = useState(chartOptions.axisType || "Single");
const [numberOfComboLines, setNumberOfComboLines] = useState(
chartOptions.numberOfComboLines || 1
);
const [gridMode, setGridMode] = useState(chartOptions.gridMode || "Auto");
const [heightMode, setHeightMode] = useState(chartOptions.heightMode || "Auto");
const [aspectDesktop, setAspectDesktop] = useState(
chartOptions.aspectDesktop || 1
);
const [aspectMobile, setAspectMobile] = useState(
chartOptions.aspectMobile || 1
);
const [breakpoint, setBreakpoint] = useState(chartOptions.breakpoint || 500);

// State for data column selection
const [labelColumn, setLabelColumn] = useState(
chartOptions.labelColumn || "A"
);
const [valueColumns, setValueColumns] = useState(
chartOptions.valueColumns || ["B", "C"]
);

// Function to get column letters (A, B, C, ...)
const getColumnLetters = () => {
const numCols = spreadsheetData[0]?.length || 0; // Get number of columns from data
return Array.from({ length: numCols }, (_, i) =>
String.fromCharCode(65 + i)
); // A, B, C, ...
};

// Handle data selection changes
const handleDataOptionChange = (optionName, value) => {
switch (optionName) {
case "labelColumn":
setLabelColumn(value);
break;
case "valueColumns":
setValueColumns(value);
break;
default:
break;
}

onOptionChange({
...chartOptions,
labelColumn: optionName === "labelColumn" ? value : labelColumn,
valueColumns: optionName === "valueColumns" ? value : valueColumns,
});
};

// Handle option changes and propagate them up
const handleOptionChange = (optionName, value) => {
switch (optionName) {
case "theme":
setTheme(value);
break;
case "chartType":
setChartType(value);
break;
case "axisType":
setAxisType(value);
break;
case "numberOfComboLines":
setNumberOfComboLines(value);
break;
case "gridMode":
setGridMode(value);
break;
case "heightMode":
setHeightMode(value);
break;
case "aspectDesktop":
setAspectDesktop(value);
break;
case "aspectMobile":
setAspectMobile(value);
break;
case "breakpoint":
setBreakpoint(value);
break;
default:
break;
}

onOptionChange({
...chartOptions,
[optionName]: value,
});
};

const handleResetTheme = () => {
// Implement your reset logic here, e.g.,
const defaultTheme = "Flourish: Apex";
setTheme(defaultTheme);
onOptionChange({ ...chartOptions, theme: defaultTheme });
};

return (
<Box sx={{ p: 2 }}>
{/* Chart Options Panel */}
<Accordion defaultExpanded>
<AccordionSummary expandIcon={<ExpandMoreIcon />}>
  <Typography variant="h6">Chart Options</Typography>
</AccordionSummary>
<AccordionDetails>
  <Box sx={{ width: "100%" }}>
    {/* ... (Existing accordions for Theme, Chart Type, Axis Type, etc.) - No major changes needed here*/}
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Theme</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ display: "flex", alignItems: "center" }}>
        <FormControl fullWidth size="small" sx={{ mr: 2 }}>
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            id="theme-select"
            value={theme}
            label="Theme"
            onChange={(e) => handleOptionChange("theme", e.target.value)}
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
      </AccordionDetails>
    </Accordion>
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Chart Type</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth size="small">
          <InputLabel id="chart-type-label">Chart Type</InputLabel>
          <Select
            labelId="chart-type-label"
            id="chart-type"
            value={chartType}
            label="Chart Type"
            onChange={(e) =>
              handleOptionChange("chartType", e.target.value)
            }
          >
            <MenuItem value="Combo: Lines & columns (stacked)">
              Combo: Lines & columns (stacked)
            </MenuItem>
            {/* Add more chart types here */}
          </Select>
        </FormControl>
      </AccordionDetails>
    </Accordion>
    <Divider sx={{ my: 2 }} />
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
            variant={axisType === "Single" ? "contained" : "outlined"}
            onClick={() => handleOptionChange("axisType", "Single")}
          >
            Single
          </Button>
        </LightTooltip>
        <LightTooltip title="Dual Axis">
          <Button
            variant={axisType === "Dual" ? "contained" : "outlined"}
            onClick={() => handleOptionChange("axisType", "Dual")}
          >
            Dual
          </Button>
        </LightTooltip>
      </ButtonGroup>
      <TextField
        label="Number of combo lines"
        type="number"
        value={numberOfComboLines}
        onChange={(e) =>
          handleOptionChange("numberOfComboLines", e.target.value)
        }
        size="small"
        sx={{ width: 80 }}
      />
    </Box>
    <Divider sx={{ my: 2 }} />
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
              gridMode === "Single chart" ? "contained" : "outlined"
            }
            onClick={() => handleOptionChange("gridMode", "Single chart")}
          >
            Single chart
          </Button>
        </LightTooltip>
        <LightTooltip title="Grid of Charts">
          <Button
            variant={
              gridMode === "Grid of charts" ? "contained" : "outlined"
            }
            onClick={() =>
              handleOptionChange("gridMode", "Grid of charts")
            }
          >
            Grid of charts
          </Button>
        </LightTooltip>
      </ButtonGroup>
    </Box>

    <Divider sx={{ my: 2 }} />

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
            variant={heightMode === "Auto" ? "contained" : "outlined"}
            onClick={() => handleOptionChange("heightMode", "Auto")}
          >
            Auto
          </Button>
        </LightTooltip>
        <LightTooltip title="Standard">
          <Button
            variant={
              heightMode === "Standard" ? "contained" : "outlined"
            }
            onClick={() => handleOptionChange("heightMode", "Standard")}
          >
            Standard
          </Button>
        </LightTooltip>
        <LightTooltip title="Aspect Ratio">
          <Button
            variant={
              heightMode === "Aspect ratio" ? "contained" : "outlined"
            }
            onClick={() =>
              handleOptionChange("heightMode", "Aspect ratio")
            }
          >
            Aspect ratio
          </Button>
        </LightTooltip>
      </ButtonGroup>
    </Box>
    <Divider sx={{ my: 2 }} />
    <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
      <TextField
        label="Aspect (desktop)"
        type="number"
        value={aspectDesktop}
        onChange={(e) =>
          handleOptionChange("aspectDesktop", e.target.value)
        }
        size="small"
        sx={{ width: 80, mr: 2 }}
      />
      <TextField
        label="Aspect (mobile)"
        type="number"
        value={aspectMobile}
        onChange={(e) =>
          handleOptionChange("aspectMobile", e.target.value)
        }
        size="small"
        sx={{ width: 80, mr: 2 }}
      />
      <TextField
        label="Breakpoint"
        type="number"
        value={breakpoint}
        onChange={(e) => handleOptionChange("breakpoint", e.target.value)}
        size="small"
        sx={{ width: 80 }}
      />
    </Box>
    <Divider sx={{ my: 2 }} />
    {/* New Accordions for expanded functionality */}
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Grid of charts</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Grid of charts" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Controls & filters</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Controls & filters" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Colors</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Colors" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Lines, dots and areas</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Lines, dots and areas" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Bars</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Bars" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Labels</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Labels" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>X axis</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "X axis" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Y axis</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Y axis" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Y axis (right)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Y axis (right)" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Plot background</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Plot background" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Number formatting</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Number formatting" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Legend</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Legend" options here */}
      </AccordionDetails>
    </Accordion>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Popups & panels</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Add content for "Popups & panels" options here */}
      </AccordionDetails>
    </Accordion>
  </Box>
</AccordionDetails>
</Accordion>

{/* Data Selection Panel */}
<Accordion defaultExpanded>
<AccordionSummary expandIcon={<ExpandMoreIcon />}>
  <Typography variant="h6">Data</Typography>
</AccordionSummary>
<AccordionDetails>
  <Box sx={{ width: "100%" }}>
    <Typography variant="body2" gutterBottom>
      SELECT COLUMNS TO VISUALISE
      <Button size="small" sx={{ ml: 2 }}>
        Auto set columns
      </Button>
    </Typography>

    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
      <InputLabel id="label-column-label">Labels/time</InputLabel>
      <Select
        labelId="label-column-label"
        id="label-column"
        value={labelColumn}
        label="Labels/time"
        onChange={(e) =>
          handleDataOptionChange("labelColumn", e.target.value)
        }
      >
        {getColumnLetters().map((col) => (
          <MenuItem key={col} value={col}>
            {col}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
      <InputLabel id="value-columns-label">Values</InputLabel>
      <Select
        labelId="value-columns-label"
        id="value-columns"
        multiple
        value={valueColumns}
        label="Values"
        onChange={(e) =>
          handleDataOptionChange("valueColumns", e.target.value)
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {getColumnLetters().map((col) => (
          <MenuItem key={col} value={col}>
            {col}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Add more data selection options here (Charts grid, Row filter, etc.) */}
  </Box>
</AccordionDetails>
</Accordion>
</Box>
);
};

export default ChartCustomizationPanel;