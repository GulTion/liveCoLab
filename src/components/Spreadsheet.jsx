import React, { useRef, useEffect, useState } from 'react';
import jspreadsheet from 'jspreadsheet-ce';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import '../styles.css';

const Spreadsheet = ({ onDataChange }) => {
  const spreadsheetRef = useRef(null);
  const [spreadsheetData, setSpreadsheetData] = useState([
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ]);

  useEffect(() => {
    const options = {
      data: spreadsheetData,
      minDimensions: [4, 4],
      onchange: (instance, cell, x, y, value) => {
        const newData = spreadsheetRef.current.jspreadsheet.getData();
        onDataChange(newData);
        setSpreadsheetData(newData);
      },
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

  return <div ref={spreadsheetRef} />;
};

export default Spreadsheet;