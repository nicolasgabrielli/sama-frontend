import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField, Typography,
  Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Papa from 'papaparse';

const Tabla = ({ csvString, onSave }) => {
  const [data, setData] = useState([['']]);
  const [columns, setColumns] = useState(['Columna 1']);
  const [fileName, setFileName] = useState('');

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
    console.log("Componente Tabla: ", csvData)
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { data, meta } = results;
          setData(data.map(row => meta.fields.map(field => row[field] || '')));
          setColumns(meta.fields);
        },
      });
    }
    setFileName(file.name);
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} sx={{ minWidth: 200, fontWeight: 'bold', border: '1px solid #ddd', backgroundColor: '#f5f5f5', textAlign: 'center', position: 'relative' }}>
                  <TextField
                    value={column}
                    onChange={(e) => handleColumnNameChange(colIndex, e.target.value)}
                    variant="standard"
                    size="small"
                    sx={{ fontWeight: 'bold', width: '100%', textAlign: 'center', mx: 1 }}
                    inputProps={{ style: { textAlign: 'center' } }}
                  />
                  <IconButton onClick={() => handleRemoveColumn(colIndex)} sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                    <Tooltip title="Eliminar columna" placement="bottom" arrow>
                      <RemoveCircleOutlineIcon />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              ))}
              <TableCell sx={{ minWidth: 200, border: '1px solid #ddd', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                <Button onClick={handleAddColumn} startIcon={<AddCircleOutlineIcon />}>
                  Añadir Columna
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex} sx={{ minWidth: 200, border: '1px solid #ddd', textAlign: 'center' }}>
                    <TextField
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      style={{ width: '100%', fontSize: '0.875rem', textAlign: 'center' }}
                      variant="outlined"
                      size="small"
                      inputProps={{ style: { textAlign: 'center' } }}
                    />
                  </TableCell>
                ))}
                <TableCell sx={{ minWidth: 50, border: '1px solid #ddd', textAlign: 'center' }}>
                  <IconButton onClick={() => handleRemoveRow(rowIndex)}>
                    <Tooltip title="Eliminar fila" placement="bottom" arrow>
                      <RemoveCircleOutlineIcon />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center' }}>
                <Button onClick={handleAddRow} startIcon={<AddCircleOutlineIcon />}>
                  Añadir Fila
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <Button onClick={handleSave} color="primary" variant="contained" sx={{ mr: 2 }}>
          Guardar
        </Button>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Cargar Archivo CSV
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={handleFileUpload}
          />
        </Button>
        <Typography variant="body2" sx={{ ml: 2 }}>
          {fileName && (
            <Box component="span" sx={{ fontWeight: 'bold' }}>
              {fileName}
            </Box>
          )}
          {fileName && <Box component="span"> seleccionado</Box>}
          {!fileName && <Box component="span">No se ha seleccionado ningún archivo</Box>}
        </Typography>
      </Box>
    </Box>
  );
};

export default Tabla;
