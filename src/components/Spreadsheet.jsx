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
    const toolbar = [
      {
        type: 'i',
        content: 'undo',
        onclick: () => spreadsheetRef.current.jspreadsheet.undo(),
      },
      {
        type: 'i',
        content: 'redo',
        onclick: () => spreadsheetRef.current.jspreadsheet.redo(),
      },
      {
        type: 'i',
        content: 'save',
        onclick: () => {
          const newData = spreadsheetRef.current.jspreadsheet.getData();
          onDataChange(newData);
          setSpreadsheetData(newData);
        },
      },
      {
        type: 'select',
        k: 'font-family',
        v: ['Arial', 'Verdana', 'Times New Roman'],
      },
      {
        type: 'select',
        k: 'font-size',
        v: ['9px', '10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', '18px', '19px', '20px'],
      },
      {
        type: 'i',
        content: 'format_align_left',
        k: 'text-align',
        v: 'left',
      },
      {
        type: 'i',
        content: 'format_align_center',
        k: 'text-align',
        v: 'center',
      },
      {
        type: 'i',
        content: 'format_align_right',
        k: 'text-align',
        v: 'right',
      },
      {
        type: 'i',
        content: 'format_bold',
        k: 'font-weight',
        v: 'bold',
      },
      {
        type: 'color',
        content: 'format_color_text',
        k: 'color',
      },
      {
        type: 'color',
        content: 'format_color_fill',
        k: 'background-color',
      },
    ];

    const options = {
      // toolbar: toolbar, // Pass the toolbar array here
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