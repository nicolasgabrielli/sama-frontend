import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography
} from '@mui/material';
import Papa from 'papaparse';

const VerTabla = ({ csvString }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (csvString) {
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { data, meta } = results;
          setData(data);
          setColumns(meta.fields);
        },
      });
    }
  }, [csvString]);

  return (
    <Box>
      {data.length > 0 ? (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{ minWidth: 150, fontSize: '0.875rem', fontWeight: 'bold' }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} sx={{ minWidth: 150, fontSize: '0.875rem' }}>
                      {row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          No hay datos para mostrar.
        </Typography>
      )}
    </Box>
  );
};

export default VerTabla;
