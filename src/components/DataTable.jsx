import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import { Download as DownloadIcon, Search as SearchIcon } from '@mui/icons-material';

const DataTable = ({ columns, data = [], title = 'Export_Data' }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredData = data.filter((row) => {
    return columns.some((col) => {
      const value = col.renderCell ? '' : row[col.field];
      return String(value || '').toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0);
  };

  const sortedData = stableSort(filteredData, getComparator(order, orderBy));
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleExportCSV = () => {
    const csvHeaders = columns.map(c => c.headerName).join(',');
    const csvRows = data.map(row =>
      columns.map(col => {
        const val = col.renderCell ? row[col.field] : row[col.field];
        return `"${String(val || '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Filter data grid..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size="small" />
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExportCSV}
          size="small"
        >
          Export CSV
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align || 'left'}
                  sortDirection={orderBy === col.field ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? order : 'asc'}
                    onClick={() => handleRequestSort(col.field)}
                  >
                    {col.headerName}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row.id || index} hover>
                {columns.map((col) => (
                  <TableCell key={col.field} align={col.align || 'left'}>
                    {col.renderCell ? col.renderCell(row) : String(row[col.field] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No matching records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default DataTable;
