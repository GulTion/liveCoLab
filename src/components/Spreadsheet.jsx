import React, { useRef, useEffect, useState } from 'react';
import jspreadsheet from 'jspreadsheet-ce';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import '../styles.css'; // Assuming you have some custom styles

import StatsTable from './StatsTable'; // Import the StatsTable component

import '@mui/material/styles';

const Spreadsheet = ({ spreadsheetData, onDataChange }) => {
  const spreadsheetRef = useRef(null);
  // const [spreadsheetData, setSpreadsheetData] = useState([
  //   ['10', '5', '8', '12'],
  //   ['3', '7', '6', '9'],
  //   ['15', '11', '9', '7'],
  // ]);

  useEffect(() => {
    const toolbar = [

      {
        type: 'i',
        content: 'IR',
        onclick: () => {
          spreadsheetRef.current.jspreadsheet.insertRow();
          const data = spreadsheetRef.current.jspreadsheet.getData();
        onDataChange(data);
        // setSpreadsheetData(data);
        },
        title: 'New Row'
      },
      {
        type: 'i',
        content: 'IC',
        onclick: () => {
          spreadsheetRef.current.jspreadsheet.insertColumn();
          const data = spreadsheetRef.current.jspreadsheet.getData();
        onDataChange(data);
        // setSpreadsheetData(data);
        },
        title: 'New Column'
      },
    ];

    const options = {
      toolbar: toolbar,
      data: spreadsheetData,
      minDimensions: [4, 4],
      columnSorting: true,
      columnFilters: true,
      allowManualInsertRow: true,
      allowManualInsertColumn: true,
      filters:true,
      onchange: (instance) => {
        const data = spreadsheetRef.current.jspreadsheet.getData();
        onDataChange(data);
        // setSpreadsheetData(data);
      },
      columns: Array(spreadsheetData[0].length).fill({
        readOnly: false,
      }),
    };

    if (!spreadsheetRef.current.jspreadsheet) {
      spreadsheetRef.current.jspreadsheet = jspreadsheet(
        spreadsheetRef.current,
        options
      );
    } else {
      spreadsheetRef.current.jspreadsheet.setData(spreadsheetData);
    }
  }, [spreadsheetData, onDataChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div ref={spreadsheetRef} style={{ marginBottom: '20px' }} /> {/* Add margin here */}
    <StatsTable data={spreadsheetData} />
  </div>
  );
};

export default Spreadsheet;