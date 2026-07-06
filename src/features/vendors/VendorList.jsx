import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Grid
} from '@mui/material';
import DataTable from '../../components/DataTable';
import KpiCard from '../../components/KpiCard';
import Loader from '../../components/Loader';
import { fetchVendors } from '../../store/slices/vendorSlice';

const VendorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { vendors, loading } = useSelector((state) => state.vendors);

  const [search, setSearch] = useState('');
  const [certFilter, setCertFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  if (loading && vendors.length === 0) {
    return <Loader message="Retrieving vendor governance directories..." />;
  }

  // Derive counts
  const totalVendors = vendors.length;
  const pendingRenewals = vendors.filter(v => v.certificationStatus === 'Pending Renewal').length;
  const expiredCerts = vendors.filter(v => v.certificationStatus === 'Expired').length;
  const suspendedCount = vendors.filter(v => v.certificationStatus === 'Suspended').length;

  // Filter vendors locally
  const filteredVendors = vendors.filter(v => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase());
    const matchesCert = certFilter === 'All' || v.certificationStatus === certFilter;
    const matchesRisk = riskFilter === 'All' || v.riskRating === riskFilter;

    return matchesSearch && matchesCert && matchesRisk;
  });

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'Vendor Name',
      renderCell: (row) => (
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate(`/vendors/${row.id}`)}
        >
          {row.name}
        </Typography>
      )
    },
    {
      field: 'riskScore',
      headerName: 'Risk Score',
      align: 'right',
      renderCell: (row) => `${row.riskScore}/100`
    },
    {
      field: 'riskRating',
      headerName: 'Risk Rating',
      renderCell: (row) => {
        const colors = { Low: 'success', Medium: 'warning', High: 'error', Critical: 'error' };
        return <Chip label={row.riskRating} color={colors[row.riskRating]} size="small" variant="outlined" />;
      }
    },
    {
      field: 'certificationStatus',
      headerName: 'Certification Status',
      renderCell: (row) => {
        const colors = { Active: 'success', 'Pending Renewal': 'warning', Expired: 'error', Suspended: 'default' };
        return <Chip label={row.certificationStatus} color={colors[row.certificationStatus]} size="small" />;
      }
    },
    { field: 'financialStability', headerName: 'Financial Stability' },
    { field: 'activeContractsCount', headerName: 'Active Contracts', align: 'right' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Vendor Governance</Typography>
        <Typography variant="body2" color="text.secondary">Review compliance certifications, risk classifications, and portfolios.</Typography>
      </Box>

      {/* KPI Cards Row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Total Vendors" value={totalVendors} color="primary.main" subtitle="Total onboarded vendors" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Pending Renewals" value={pendingRenewals} color="warning.main" subtitle="Certificates close to expiry" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Expired Certificates" value={expiredCerts} color="error.main" subtitle="Lacking valid credentials" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard title="Suspended Vendors" value={suspendedCount} color="error.dark" subtitle="Blocked vendor operations" />
        </Grid>
      </Grid>

      {/* Filters Card */}
      <Card sx={{ mb: 3, boxShadow: 1 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Search Vendors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Certification Status</InputLabel>
                <Select value={certFilter} label="Certification Status" onChange={(e) => setCertFilter(e.target.value)}>
                  <MenuItem value="All">All Certifications</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Pending Renewal">Pending Renewal</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Risk Rating</InputLabel>
                <Select value={riskFilter} label="Risk Rating" onChange={(e) => setRiskFilter(e.target.value)}>
                  <MenuItem value="All">All Risk Ratings</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vendors Data Table */}
      <DataTable columns={columns} data={filteredVendors} title="Vendor_Governance_Directory" />
    </Box>
  );
};

export default VendorList;
