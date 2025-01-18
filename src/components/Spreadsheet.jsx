import React, { useRef, useEffect, useState } from 'react';
import jspreadsheet from 'jspreadsheet-ce';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import '../styles.css';

const Spreadsheet = ({ onDataChange }) => {
  const spreadsheetRef = useRef(null);
  const [spreadsheetData, setSpreadsheetData] = useState([
    ['10', '5', '8', '12'],
    ['3', '7', '6', '9'],
    ['15', '11', '9', '7'],
  ]);

  useEffect(() => {

    const options = {
      // toolbar: toolbar, // Pass the toolbar array here
      data: spreadsheetData,
      minDimensions: [4, 4],
      onchange: (...x) => {
        console.log(x);
        
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