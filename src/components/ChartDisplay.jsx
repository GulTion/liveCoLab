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

  const plotData = options.charts.map((chart, index) => {
    if (chart.chartType === 'heatmap') {
      // Heatmap
      if (!chart.heatmapZColumn) {
        console.error("Missing Z-Column for heatmap");
        return null; // Handle missing Z-column
      }

      const zColumnIndex = getColumnIndex(chart.heatmapZColumn);
      const zData = data.map((row) => parseFloat(row[zColumnIndex] || 0));

      // Create a 2D array for the z-data (restructure as needed)
      const zValues = [];
      for (let i = 0; i < labels.length; i++) {
        zValues.push([zData[i]]); // Simple example, adjust based on your data
      }

      return {
        type: 'heatmap',
        x: labels,
        y: labels, // Might need to adjust this based on your desired heatmap layout
        z: zValues,
        colorscale: 'Viridis', // Example colorscale
        name: `Chart ${index + 1} (Heatmap)`,
      };
    } else if (chart.chartType === 'scatter3d') {
      // 3D Scatter Plot
      if (!chart.valueColumnZ) {
        console.error("Missing Z-Column for 3D scatter plot");
        return null; // Handle missing Z-column
      }
    
      const xColumnIndex = getColumnIndex(chart.valueColumn);
      const yColumnIndex = getColumnIndex(options.labelColumn);
      const zColumnIndex = getColumnIndex(chart.valueColumnZ);
    
      return {
        type: 'scatter3d',
        x: data.map((row) => parseFloat(row[xColumnIndex] || 0)),
        y: data.map((row) => row[yColumnIndex] || ''), // Assuming labels are used for Y
        z: data.map((row) => parseFloat(row[zColumnIndex] || 0)),
        mode: 'markers',
        marker: {
          size: 12,
          color: chart.color,
          opacity: 0.8
        },
        name: `Chart ${index + 1} (3D Scatter)`,
      };
    }
     else {
      // Other chart types (line, bar, scatter)
      const xData = chart.chartType === 'scatter'
      ? data.map((row) => parseFloat(row[getColumnIndex(chart.valueColumn)] || 0))
      : labels;
  
      const yData = chart.chartType === 'scatter'
        ? labels 
        : data.map((row) => parseFloat(row[getColumnIndex(chart.valueColumn)] || 0));
  
      return {
        x: xData,
        y: yData,
        type: chart.chartType,
        mode: chart.chartType === 'line' ? 'lines+markers' : 'markers',
        marker: { color: chart.color },
        name: `Chart ${index + 1} (${chart.chartType})`,
      };
    }
  });

  // Remove any nulls if a chart type couldn't be rendered
  const validPlotData = plotData.filter((chart) => chart !== null);

  // Prepare layout options for Plotly
  const layout = {
    title: `Chart Data`,
    yaxis: {
      title: 'Values',
      rangemode: 'tozero',
    },
    xaxis: {
      title: 'Labels',
    },
    // Add more layout customizations here based on your requirements
  };

  return (
    <div>
      <Plot
        ref={chartRef}
        data={validPlotData} // Use validPlotData
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ChartDisplay;