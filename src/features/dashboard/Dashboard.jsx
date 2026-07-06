import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid, Typography, Box, Card, CardContent, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { fetchRequests } from '../../store/slices/procurementSlice';
import { fetchVendors } from '../../store/slices/vendorSlice';

const StatCard = ({ label, value, color = 'primary.main' }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h4" fontWeight="bold" color={color} sx={{ mt: 1 }}>{value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state) => state.procurement);
  const { vendors } = useSelector((state) => state.vendors);

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchVendors());
  }, [dispatch]);

  const total = requests.length;
  const pending = requests.filter(r => r.status === 'Pending').length;
  const approved = requests.filter(r => r.status === 'Approved').length;
  const rejected = requests.filter(r => r.status === 'Rejected').length;

  const recent = [...requests].slice(0, 8);

  const statusColor = (s) =>
    s === 'Approved' ? 'success' : s === 'Rejected' ? 'error' : 'warning';

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Overview of procurement and vendor activity
      </Typography>

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard label="Total Requests" value={total} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Pending" value={pending} color="warning.main" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Approved" value={approved} color="success.main" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Rejected" value={rejected} color="error.main" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Vendors" value={vendors.length} color="info.main" />
        </Grid>
      </Grid>

      {/* Recent Requests */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Recent Requests
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recent.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.title || 'Untitled Request'}</TableCell>
                    <TableCell>{r.department}</TableCell>
                    <TableCell align="right">${Number(r.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={r.status} color={statusColor(r.status)} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
