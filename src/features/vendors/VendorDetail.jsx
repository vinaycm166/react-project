import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Tab, Tabs, Button, Chip,
  Grid, Divider, List, ListItem, ListItemText, TextField,
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import { fetchVendorById, uploadVendorDocument, clearSelectedVendor } from '../../store/slices/vendorSlice';

const EMPTY_DOC = { name: '', type: 'Security Certificate', expiry: '' };

const VendorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedVendor, detailLoading, error } = useSelector((state) => state.vendors);
  const { user } = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [docForm, setDocForm] = useState(EMPTY_DOC);
  const [docErrors, setDocErrors] = useState({});
  const [docSubmitErr, setDocSubmitErr] = useState(null);
  const [docSubmitting, setDocSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchVendorById(id));
    return () => { dispatch(clearSelectedVendor()); };
  }, [dispatch, id]);

  if (detailLoading) return <Loader message="Loading vendor details..." />;
  if (error || !selectedVendor) {
    return <ErrorState message={error || 'Vendor not found.'} onRetry={() => dispatch(fetchVendorById(id))} />;
  }

  const handleTabChange = (_, val) => setTabValue(val);

  const handleDocChange = (field) => (e) => {
    setDocForm((p) => ({ ...p, [field]: e.target.value }));
    setDocErrors((p) => ({ ...p, [field]: '' }));
  };

  const validateDoc = () => {
    const e = {};
    if (!docForm.name.trim()) e.name = 'Document name is required';
    if (!docForm.type) e.type = 'Document type is required';
    if (!docForm.expiry) e.expiry = 'Expiry date is required';
    return e;
  };

  const handleAddDocument = async () => {
    const e = validateDoc();
    if (Object.keys(e).length > 0) { setDocErrors(e); return; }
    setDocSubmitting(true);
    setDocSubmitErr(null);
    try {
      await dispatch(uploadVendorDocument({ id: selectedVendor.id, docData: docForm })).unwrap();
      setModalOpen(false);
      setDocForm(EMPTY_DOC);
      setDocErrors({});
    } catch (err) {
      setDocSubmitErr(err || 'Failed to upload document');
    } finally {
      setDocSubmitting(false);
    }
  };

  const handleDocClose = () => {
    setModalOpen(false);
    setDocForm(EMPTY_DOC);
    setDocErrors({});
    setDocSubmitErr(null);
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/vendors')} sx={{ mb: 2 }}>
        Back to Directory
      </Button>

      {/* Profile Overview Card */}
      <Card sx={{ mb: 3, boxShadow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {selectedVendor.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Vendor ID: {selectedVendor.id} | Active Contracts: {selectedVendor.activeContractsCount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={selectedVendor.certificationStatus} color={
                selectedVendor.certificationStatus === 'Active' ? 'success' :
                selectedVendor.certificationStatus === 'Pending Renewal' ? 'warning' :
                selectedVendor.certificationStatus === 'Expired' ? 'error' : 'default'
              } />
              <Chip label={`Risk Class: ${selectedVendor.riskRating}`} color={selectedVendor.riskScore > 75 ? 'error' : 'success'} variant="outlined" />
            </Box>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">Financial Stability</Typography>
              <Typography variant="body2" fontWeight="bold">{selectedVendor.financialStability}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">Corporate Risk Score</Typography>
              <Typography variant="body2" fontWeight="bold" color={selectedVendor.riskScore > 50 ? 'error.main' : 'success.main'}>
                {selectedVendor.riskScore}/100
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs Menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="vendor profile sections">
          <Tab label="Basic Details" />
          <Tab label="Contacts" />
          <Tab label="Compliance Documents" />
          <Tab label="Risk Information" />
          <Tab label="History Logs" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Card sx={{ mb: 3, boxShadow: 1 }}>
        <CardContent>
          {tabValue === 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Corporate Details</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Full Business Name</Typography>
                  <Typography variant="body2" paragraph>{selectedVendor.name}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Vendor Database Code</Typography>
                  <Typography variant="body2" paragraph>{selectedVendor.id}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Active Contract Count</Typography>
                  <Typography variant="body2" paragraph>{selectedVendor.activeContractsCount} Contracts</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">Treasury Status</Typography>
                  <Typography variant="body2" paragraph>{selectedVendor.financialStability}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Corporate Contacts</Typography>
              <List>
                {selectedVendor.contacts.map((contact, i) => (
                  <ListItem key={i} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                    <ListItemText
                      primary={contact.name}
                      secondary={
                        <>
                          <Typography variant="caption" color="text.primary" display="block">Role: {contact.role}</Typography>
                          <Typography variant="caption" color="text.secondary">Email: {contact.email} | Phone: {contact.phone}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">Compliance Dossier</Typography>
                {user?.role === 'Compliance Officer' && (
                  <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
                    Add Certificate
                  </Button>
                )}
              </Box>
              <List>
                {selectedVendor.documents.map((doc) => (
                  <ListItem
                    key={doc.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1.5,
                      bgcolor: 'action.hover'
                    }}
                  >
                    <ListItemText
                      primary={doc.name}
                      secondary={`Type: ${doc.type} | Expiration Date: ${doc.expiry}`}
                    />
                    <Chip
                      label={doc.status}
                      size="small"
                      color={
                        doc.status === 'Verified' ? 'success' :
                        doc.status === 'Expired' ? 'error' : 'warning'
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {tabValue === 3 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Risk Center Assessment Report</Typography>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  The corporate risk level is evaluated continuously against third-party filings, credit indices, and security certification checklists.
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
                  Calculated Exposure Level: {selectedVendor.riskRating.toUpperCase()} ({selectedVendor.riskScore}/100)
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                * Note: Vendor risk above 70 requires secondary executive waivers on active procurement workflows.
              </Typography>
            </Box>
          )}

          {tabValue === 4 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Audit Logs & History</Typography>
              <List>
                {selectedVendor.history.map((event, i) => (
                  <ListItem key={i} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={event.event}
                      secondary={`Registered by: ${event.user} on ${event.date}`}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upload Document Dialog */}
      <Dialog open={modalOpen} onClose={handleDocClose} fullWidth maxWidth="sm">
        <DialogTitle>Upload Compliance Document</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {docSubmitErr && <Alert severity="error">{docSubmitErr}</Alert>}
            <TextField label="Document Name" fullWidth size="small"
              value={docForm.name} onChange={handleDocChange('name')}
              error={!!docErrors.name} helperText={docErrors.name} />
            <FormControl fullWidth size="small" error={!!docErrors.type}>
              <InputLabel>Document Type</InputLabel>
              <Select value={docForm.type} label="Document Type" onChange={handleDocChange('type')}>
                <MenuItem value="Security Certificate">Security Certificate (ISO, SOC 2)</MenuItem>
                <MenuItem value="Insurance Document">Insurance Certificate</MenuItem>
                <MenuItem value="Tax Document">Tax W-9 Form</MenuItem>
                <MenuItem value="Legal Document">Legal / NDA Agreement</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Expiry Date" type="date" fullWidth size="small"
              InputLabelProps={{ shrink: true }}
              value={docForm.expiry} onChange={handleDocChange('expiry')}
              error={!!docErrors.expiry} helperText={docErrors.expiry} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={handleDocClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddDocument} disabled={docSubmitting}>
            {docSubmitting ? 'Uploading...' : 'Upload Document'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorDetail;
