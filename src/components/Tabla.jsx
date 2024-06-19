import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Papa from 'papaparse';

const Tabla = ({ csvString, onSave }) => {
  const [data, setData] = useState([['']]);
  const [columns, setColumns] = useState(['Columna 1']);

  useEffect(() => {
    if (csvString) {
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { data, meta } = results;
          setData(data.map(row => meta.fields.map(field => row[field] || '')));
          setColumns(meta.fields);
        },
      });
    }
  }, [csvString]);

  const handleAddRow = () => {
    setData([...data, Array(columns.length).fill('')]);
  };

  const handleAddColumn = () => {
    setColumns([...columns, `Columna ${columns.length + 1}`]);
    setData(data.map(row => [...row, '']));
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, rowIndex) => rowIndex !== index);
    setData(newData);
  };

  const handleRemoveColumn = (index) => {
    const newColumns = columns.filter((_, colIndex) => colIndex !== index);
    setColumns(newColumns);
    setData(data.map(row => row.filter((_, colIndex) => colIndex !== index)));
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const handleColumnNameChange = (colIndex, value) => {
    const newColumns = [...columns];
    newColumns[colIndex] = value;
    setColumns(newColumns);
  };

  const handleSave = () => {
    const csvData = Papa.unparse({
      fields: columns,
      data: data
    });
    onSave(csvData);
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} sx={{ minWidth: 200, fontWeight: 'bold' }}>
                  <TextField
                    value={column}
                    onChange={(e) => handleColumnNameChange(colIndex, e.target.value)}
                    variant="standard"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <IconButton onClick={() => handleRemoveColumn(colIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              ))}
              <TableCell sx={{ minWidth: 50 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex} sx={{ minWidth: 200 }}>
                    <TextField
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      style={{ width: '100%', fontSize: '0.1rem' }}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                ))}
                <TableCell sx={{ minWidth: 50 }}>
                  <IconButton onClick={() => handleRemoveRow(rowIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleAddRow} startIcon={<AddIcon />} sx={{ mt: 2 }}>
        Añadir Fila
      </Button>
      <Button onClick={handleAddColumn} startIcon={<AddIcon />} sx={{ mt: 2, ml: 2 }}>
        Añadir Columna
      </Button>
      <Button onClick={handleSave} color="primary" variant="contained" sx={{ mt: 2, ml: 2 }}>
        Guardar
      </Button>
    </Box>
  );
};

export default Tabla;
