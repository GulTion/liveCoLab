import React, { useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

// MUI imports
import { useTheme } from '@mui/material/styles';

const ChartDisplay = ({ data, options }) => {
  const chartRef = useRef(null);
  const theme = useTheme();

  // Function to convert column letter to index
  const getColumnIndex = (col) => {
    let index = 0;
    for (let i = 0; i < col.length; i++) {
      index = index * 26 + (col.charCodeAt(i) - 64); // "A" is 65 in ASCII
    }
    return index - 1; // Adjust to 0-based index
  };

  // Prepare data for Plotly
  const labelColumnIndex = getColumnIndex(options.labelColumn);
  const labels = data.map((row) => row[labelColumnIndex] || '');

  const plotData = options.charts.map((chart, index) => ({
    x: labels,
    y: data.map((row) => parseFloat(row[getColumnIndex(chart.valueColumn)] || 0)),
    type: chart.chartType === 'line' ? 'scatter' : chart.chartType, // Map 'line' to 'scatter' for Plotly
    mode: chart.chartType === 'line' ? 'lines+markers' : undefined, // Add markers for line charts
    marker: { color: chart.color },
    name: `Chart ${index + 1} (${chart.chartType})`,
  }));

  // Prepare layout options for Plotly
  const layout = {
    title: `Chart Data`,
    yaxis: {
      title: 'Values', // Add a y-axis title
      rangemode: 'tozero', // Start y-axis at zero (similar to beginAtZero: true in Chart.js)
    },
    xaxis: {
      title: 'Labels',
    },
    // You can add more layout customizations here based on your requirements
  };

  return (
    <div>
      <Plot
        ref={chartRef}
        data={plotData}
        layout={layout}
        useResizeHandler={true} // Enable auto-resizing
        style={{ width: '100%', height: '100%' }} // Make the chart responsive
      />
    </div>
  );
};

export default ChartDisplay;