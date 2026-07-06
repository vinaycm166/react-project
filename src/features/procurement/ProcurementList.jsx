import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Card, CardContent,
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import { fetchRequests, createRequest, setFilter, resetFilters } from '../../store/slices/procurementSlice';
import { fetchVendors } from '../../store/slices/vendorSlice';

// Simple controlled form state — avoids all RHF + MUI Select compatibility issues
const EMPTY_FORM = {
  title: '',
  amount: '',
  department: 'Engineering',
  vendorId: '',
  riskRating: 'Low',
  description: ''
};

const ProcurementList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { requests, loading, filters } = useSelector((state) => state.procurement);
  const { vendors } = useSelector((state) => state.vendors);
  const { user } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim() || form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = 'Enter a valid positive amount';
    if (!form.department) errs.department = 'Department is required';
    if (!form.vendorId) errs.vendorId = 'Please select a vendor';
    if (!form.riskRating) errs.riskRating = 'Risk rating is required';
    if (!form.description.trim() || form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await dispatch(createRequest({ ...form, amount: Number(form.amount) })).unwrap();
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setFormErrors({});
    } catch (err) {
      setSubmitError(err || 'Failed to create request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSubmitError(null);
  };

  // Filter requests locally
  const filteredRequests = requests.filter((r) => {
    const q = filters.search.toLowerCase();
    const matchSearch = r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || (r.vendorName || '').toLowerCase().includes(q);
    const matchStatus = filters.status === 'All' || r.status === filters.status;
    const matchDept = filters.department === 'All' || r.department === filters.department;
    return matchSearch && matchStatus && matchDept;
  });

  const statusColor = { Pending: 'warning', Approved: 'success', Rejected: 'error', Escalated: 'secondary' };
  const riskColor = { Low: 'success', Medium: 'warning', High: 'error', Critical: 'error' };

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'title', headerName: 'Title',
      renderCell: (row) => (
        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}
          onClick={() => navigate(`/procurement/${row.id}`)}>
          {row.title}
        </Typography>
      )
    },
    { field: 'department', headerName: 'Department' },
    { field: 'vendorName', headerName: 'Vendor' },
    {
      field: 'amount', headerName: 'Amount', align: 'right',
      renderCell: (row) => `$${Number(row.amount).toLocaleString()}`
    },
    {
      field: 'riskRating', headerName: 'Risk',
      renderCell: (row) => <Chip label={row.riskRating} color={riskColor[row.riskRating] || 'default'} size="small" />
    },
    {
      field: 'status', headerName: 'Status',
      renderCell: (row) => <Chip label={row.status} color={statusColor[row.status] || 'default'} size="small" />
    },
    { field: 'submissionDate', headerName: 'Date' }
  ];

  if (loading && requests.length === 0) {
    return <Loader message="Loading procurement data..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Procurement Workspace</Typography>
          <Typography variant="body2" color="text.secondary">Review, track, and create purchase requests.</Typography>
        </Box>
        {(user?.role === 'Employee' || user?.role === 'Administrator') && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
            New Request
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField fullWidth size="small" label="Search" value={filters.search}
                onChange={(e) => dispatch(setFilter({ search: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={filters.status} label="Status"
                  onChange={(e) => dispatch(setFilter({ status: e.target.value }))}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Escalated">Escalated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select value={filters.department} label="Department"
                  onChange={(e) => dispatch(setFilter({ department: e.target.value }))}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="IT Operations">IT Operations</MenuItem>
                  <MenuItem value="Facilities">Facilities</MenuItem>
                  <MenuItem value="Security Operations">Security Operations</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Legal Affairs">Legal Affairs</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="outlined" size="small" onClick={() => dispatch(resetFilters())}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable columns={columns} data={filteredRequests} title="Procurement_Requests" />

      {/* Create Request Dialog */}
      <Dialog open={modalOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Procurement Request</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {submitError && <Alert severity="error">{submitError}</Alert>}

            <TextField
              label="Request Title"
              fullWidth
              size="small"
              value={form.title}
              onChange={handleChange('title')}
              error={!!formErrors.title}
              helperText={formErrors.title}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Amount ($)"
                  type="number"
                  fullWidth
                  size="small"
                  value={form.amount}
                  onChange={handleChange('amount')}
                  error={!!formErrors.amount}
                  helperText={formErrors.amount}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" error={!!formErrors.department}>
                  <InputLabel>Department</InputLabel>
                  <Select value={form.department} label="Department" onChange={handleChange('department')}>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="IT Operations">IT Operations</MenuItem>
                    <MenuItem value="Facilities">Facilities</MenuItem>
                    <MenuItem value="Security Operations">Security Operations</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Legal Affairs">Legal Affairs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControl fullWidth size="small" error={!!formErrors.vendorId}>
              <InputLabel>Vendor</InputLabel>
              <Select value={form.vendorId} label="Vendor" onChange={handleChange('vendorId')}>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name} — {v.riskRating} Risk
                  </MenuItem>
                ))}
              </Select>
              {formErrors.vendorId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {formErrors.vendorId}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth size="small" error={!!formErrors.riskRating}>
              <InputLabel>Risk Rating</InputLabel>
              <Select value={form.riskRating} label="Risk Rating" onChange={handleChange('riskRating')}>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Business Description"
              multiline
              rows={3}
              fullWidth
              size="small"
              value={form.description}
              onChange={handleChange('description')}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProcurementList;
