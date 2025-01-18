import React, { useRef, useEffect } from 'react';
import jspreadsheet from 'jspreadsheet-ce';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import '../styles.css';

const StatsTable = ({ data }) => {
  const statsRef = useRef(null);

  const calculateStats = (data) => {
    if (!data || data.length === 0 || data[0].length === 0) return null;

    const numRows = data.length;
    const numCols = data[0].length;
    const stats = {
      mean: Array(numCols).fill(0),
      std: Array(numCols).fill(0),
    };

    for (let j = 0; j < numCols; j++) {
      const columnData = [];
      for (let i = 0; i < numRows; i++) {
        const cellValue = parseFloat(data[i][j]);
        if (!isNaN(cellValue)) {
          columnData.push(cellValue);
        }
      }

      if (columnData.length > 0) {
        stats.mean[j] =
          columnData.reduce((sum, val) => sum + val, 0) / columnData.length;
        stats.std[j] = Math.sqrt(
          columnData.reduce(
            (sum, val) => sum + Math.pow(val - stats.mean[j], 2),
            0
          ) / columnData.length
        );
      }
    }

    return stats;
  };

  const createStatsTable = (stats) => {
    if (!statsRef.current || !stats) return;

    const numCols = stats.mean.length;
    const statsData = [
      ['Mean', ...stats.mean.map((val) => val.toFixed(2))],
      ['Std', ...stats.std.map((val) => val.toFixed(2))],
    ];

    if (!statsRef.current.jspreadsheet) {
      statsRef.current.jspreadsheet = jspreadsheet(statsRef.current, {
        data: statsData,
        columns: [
          {
            type: 'text',
            title: 'Stats',
            width: 80,
            readOnly: true,
          },
          ...Array(numCols).fill({
            type: 'text',
            readOnly: true,
          }),
        ],
        minDimensions: [numCols + 1, 2],
      });
    } else {
      // Update the data
      statsRef.current.jspreadsheet.setData(statsData);

      // Check if columns need to be added or removed
      const currentNumCols = statsRef.current.jspreadsheet.getHeaders().split(',').length - 1; // -1 for the 'Stats' column
      if (numCols > currentNumCols) {
        // Insert new columns
        statsRef.current.jspreadsheet.insertColumn(numCols - currentNumCols, null, 1, { type: 'text', readOnly: true });
      } else if (numCols < currentNumCols) {
        // Delete extra columns
        statsRef.current.jspreadsheet.deleteColumn(numCols + 1, currentNumCols - numCols);
      }
    }
  };

  useEffect(() => {
    const stats = calculateStats(data);
    createStatsTable(stats);
  }, [data]);

  return <div ref={statsRef} className="stats-table" />;
};

export default StatsTable;