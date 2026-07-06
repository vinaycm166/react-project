import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Loader from '../../components/Loader';
import { fetchRiskData } from '../../store/slices/riskSlice';

const RiskCenter = () => {
  const dispatch = useDispatch();

  const { matrix, categories, trends, loading } = useSelector((state) => state.risk);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    dispatch(fetchRiskData());
  }, [dispatch]);

  if (loading && matrix.length === 0) {
    return <Loader message="Accessing risk matrix registers..." />;
  }

  // Helper for matrix coordinate color rating
  const getCellColor = (level) => {
    switch (level) {
      case 'Low': return '#c8e6c9'; // light green
      case 'Medium': return '#fff9c4'; // light yellow
      case 'High': return '#ffe0b2'; // light orange
      case 'Critical': return '#ffcdd2'; // light red
      default: return '#fafafa';
    }
  };

  const getCellTextColor = (level) => {
    switch (level) {
      case 'Low': return '#1b5e20';
      case 'Medium': return '#f57f17';
      case 'High': return '#e65100';
      case 'Critical': return '#b71c1c';
      default: return '#000000';
    }
  };

  // Construct standard 5x5 grid from 1D array
  const grid = Array(5).fill(null).map(() => Array(5).fill(null));
  matrix.forEach(cell => {
    // Row corresponds to Likelihood (5 down to 1), Column corresponds to Impact (1 to 5)
    // Map Likelihood 5 -> Row 0, Likelihood 1 -> Row 4
    // Map Impact 1 -> Col 0, Impact 5 -> Col 4
    const row = 5 - cell.likelihood;
    const col = cell.impact - 1;
    if (row >= 0 && row < 5 && col >= 0 && col < 5) {
      grid[row][col] = cell;
    }
  });

  const handleCellClick = (cell) => {
    if (cell && cell.count > 0) {
      setSelectedCell(cell);
    } else {
      setSelectedCell(null);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Risk Center</Typography>
        <Typography variant="body2" color="text.secondary">Continuous assessment of enterprise risk vectors and mitigation tasks.</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* 5x5 Interactive Risk Matrix Grid */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: '100%', boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                5x5 Risk Exposure Matrix
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Click on any non-empty cell to review details of flagged events:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Likelihood Label & Rows */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: 'bold', mr: 2, py: 6 }}>
                    LIKELIHOOD (5 - 1)
                  </Typography>

                  <Box sx={{ flexGrow: 1 }}>
                    <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '4px' }}>
                      <TableBody>
                        {grid.map((row, rIdx) => (
                          <TableRow key={rIdx}>
                            <TableCell sx={{ border: 'none', p: 0.5, fontWeight: 'bold', width: 20 }}>
                              {5 - rIdx}
                            </TableCell>
                            {row.map((cell, cIdx) => {
                              if (!cell) return <TableCell key={cIdx} />;
                              const isSelected = selectedCell && selectedCell.likelihood === cell.likelihood && selectedCell.impact === cell.impact;
                              return (
                                <TableCell
                                  key={cIdx}
                                  onClick={() => handleCellClick(cell)}
                                  sx={{
                                    p: 1.5,
                                    textAlign: 'center',
                                    cursor: cell.count > 0 ? 'pointer' : 'default',
                                    bgcolor: getCellColor(cell.level),
                                    color: getCellTextColor(cell.level),
                                    fontWeight: 'bold',
                                    border: isSelected ? '2px solid black' : '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: 1,
                                    transition: 'transform 0.1s',
                                    '&:hover': cell.count > 0 ? { transform: 'scale(1.05)' } : {}
                                  }}
                                >
                                  {cell.count}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                        {/* Impact X Axis Labels */}
                        <TableRow>
                          <TableCell sx={{ border: 'none' }} />
                          {Array(5).fill(null).map((_, i) => (
                            <TableCell key={i} sx={{ border: 'none', p: 0.5, textAlign: 'center', fontWeight: 'bold' }}>
                              {i + 1}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="caption" fontWeight="bold">
                    IMPACT (1 - 5)
                  </Typography>
                </Box>

                {/* Risk Legends Color Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                  {['Low', 'Medium', 'High', 'Critical'].map(level => (
                    <Box key={level} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: getCellColor(level), borderRadius: 0.5 }} />
                      <Typography variant="caption">{level}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Selected Coordinates Detail List */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: '100%', boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Coordinate Risk Details
              </Typography>
              {selectedCell ? (
                <Box>
                  <Box sx={{ mb: 2, p: 1.5, bgcolor: getCellColor(selectedCell.level), borderRadius: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color={getCellTextColor(selectedCell.level)}>
                      Likelihood: {selectedCell.likelihood} | Impact: {selectedCell.impact} ({selectedCell.level} Risk)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedCell.count} active request(s) mapped to these coordinates.
                    </Typography>
                  </Box>

                  {selectedCell.requests.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No active procurement requests explicitly assigned to this coordinate cell. (Counts may belong to other system modules).
                    </Typography>
                  ) : (
                    <List>
                      {selectedCell.requests.map((reqId) => (
                        <Paper key={reqId} sx={{ p: 1.5, mb: 1, border: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="subtitle2" color="primary" sx={{ cursor: 'pointer' }} onClick={() => window.location.href = `/procurement/${reqId}`}>
                            {reqId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Verify security policies associated with this workflow contract.
                          </Typography>
                        </Paper>
                      ))}
                    </List>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  Select an active matrix coordinate to review associated procurement filings.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Visualizations row */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Risk Category Allocations</Typography>
              <Box sx={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
                  {categories.map((entry) => (
                    <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, bgcolor: entry.color, borderRadius: 0.2 }} />
                      <Typography variant="caption" color="text.secondary">{entry.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Exposure Trends Index</Typography>
              <Box sx={{ height: 260, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="open" fill="#ffab00" name="Open Mitigations" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskCenter;
