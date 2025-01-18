import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

// MUI imports
import { useTheme } from '@mui/material/styles';

const ChartDisplay = ({ data, options }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const myChartRef = chartRef.current.getContext('2d');



    // Prepare data based on selected columns
    const getColumnIndex = (col) => {
      let index = 0;
      for (let i = 0; i < col.length; i++) {
        index = index * 26 + (col.charCodeAt(i) - 64); // "A" is 65 in ASCII
      }
      return index - 1; // Adjust to 0-based index
    };

    // Get the common label column data
    const labelColumnIndex = getColumnIndex(options.labelColumn);
    
    const labels = data.map((row) => row[labelColumnIndex] || '');
    console.log({data, options });
    

    // Prepare datasets based on options.charts
    const datasets = options.charts.map((chart, index) => ({
      label: `Chart ${index + 1} (${chart.chartType})`, // Label based on chart type and index
      data: data.map((row) => parseFloat(row[getColumnIndex(chart.valueColumn)] || 0)),
      backgroundColor: chart.color,
      borderColor: chart.color,
      borderWidth: 1,
      type: chart.chartType, // Use the chart type specified in options
    }));
    console.log({datasets});
    


    // Apply chart options to the chart
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Chart Data`, // You can customize the title
        },
      },
    };
    console.log(datasets);
    



    chartInstance.current = new Chart(myChartRef, {
      type: 'bar', // You can change this based on options
      data: {datasets, labels},
      options: chartOptions,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, theme, options]);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartDisplay;


