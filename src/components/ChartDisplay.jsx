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
    const labels = options.labelColumn
      ? data.map((row) => row[options.labelColumn.charCodeAt(0) - 65] || '')
      : data.map((_, index) => `Row ${index + 1}`);

    const values = options.valueColumns
      ? options.valueColumns.map((col) =>
          data.map((row) => parseFloat(row[col.charCodeAt(0) - 65] || 0))
        )
      : [
          data.map((row) =>
            row.reduce((sum, cell) => sum + parseFloat(cell || 0), 0)
          ),
        ];

    const chartData = {
      labels: labels,
      datasets: values.map((valueSet, index) => ({
        label: options.valueColumns
          ? `Value ${options.valueColumns[index]}`
          : 'Spreadsheet Data',
        data: valueSet,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
      })),
    };

    // Apply chart options to the chart
    const updatedOptions = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Chart Theme: ${options.theme}`,
        },
      },
    };

    // Example: Change the chart type
    if (options.chartType === 'Combo: Lines & columns (stacked)') {
      chartData.datasets[0].type = 'line';
    }

    chartInstance.current = new Chart(myChartRef, {
      type: 'bar', // You can change this based on options
      data: chartData,
      options: updatedOptions,
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