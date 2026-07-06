import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  Gavel as ViolationIcon,
  Description as DocIcon,
  NewReleases as ExpiredIcon
} from '@mui/icons-material';
import Loader from '../../components/Loader';
import { fetchVendors } from '../../store/slices/vendorSlice';
import { resolveViolation } from '../../store/slices/complianceSlice';

const ComplianceCenter = () => {
  const dispatch = useDispatch();

  const { vendors, loading } = useSelector((state) => state.vendors);
  const { violations } = useSelector((state) => state.compliance);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  if (loading && vendors.length === 0) {
    return <Loader message="Accessing GRC compliance databases..." />;
  }

  // Derive expired certifications and missing documents from vendors list
  const expiredCertVendors = vendors.filter(v => v.certificationStatus === 'Expired');
  const missingDocVendors = vendors.filter(v => v.documents.some(d => d.status === 'Expired' || d.status === 'Under Review'));

  const handleResolve = (id) => {
    dispatch(resolveViolation(id));
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Compliance Center</Typography>
        <Typography variant="body2" color="text.secondary">Monitor regulatory guidelines, document verification states, and active violations.</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Compliance Violations Queue */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViolationIcon color="error" /> Active Compliance Violations
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Critical breaches that demand correction before procurement cycles:
              </Typography>
              
              <List>
                {violations.map((vio, index) => (
                  <React.Fragment key={vio.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{ px: 0 }}
                      secondaryAction={
                        vio.status === 'Open' && user?.role === 'Compliance Officer' && (
                          <Button size="small" variant="outlined" color="success" onClick={() => handleResolve(vio.id)}>
                            Resolve
                          </Button>
                        )
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography variant="subtitle2" fontWeight="bold">{vio.type}</Typography>
                            <Chip label={vio.severity} size="small" color={vio.severity === 'Critical' ? 'error' : 'warning'} sx={{ height: 20 }} />
                            <Chip label={vio.status} size="small" variant="outlined" color={vio.status === 'Resolved' ? 'success' : 'error'} sx={{ height: 20 }} />
                          </Box>
                        }
                        secondary={`Vendor: ${vio.vendor} | Detected: ${vio.dateDetected}`}
                      />
                    </ListItem>
                    {index < violations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Expired Certifications list */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ExpiredIcon color="warning" /> Expired Certifications List
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Vendors holding expired regulatory licenses or ISO credentials:
              </Typography>

              {expiredCertVendors.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No vendors with expired certs.</Typography>
              ) : (
                <List>
                  {expiredCertVendors.map((v, index) => (
                    <React.Fragment key={v.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemText
                          primary={<Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ cursor: 'pointer' }} onClick={() => window.location.href = `/vendors/${v.id}`}>{v.name}</Typography>}
                          secondary={`Vendor ID: ${v.id} | Financial Stability: ${v.financialStability}`}
                        />
                        <Chip label="Expired Status" color="error" size="small" />
                      </ListItem>
                      {index < expiredCertVendors.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Missing / Under Review Documents list */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DocIcon color="primary" /> Missing / Pending Under-Review Documents
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Required contracts or audits awaiting compliance verification or submission:
              </Typography>

              <Grid container spacing={2}>
                {missingDocVendors.map((v) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={v.id}>
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ cursor: 'pointer' }} onClick={() => window.location.href = `/vendors/${v.id}`}>{v.name}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        ID: {v.id}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {v.documents.filter(d => d.status === 'Expired' || d.status === 'Under Review').map(d => (
                          <Chip key={d.id} label={`${d.name} (${d.status})`} size="small" color={d.status === 'Expired' ? 'error' : 'warning'} />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComplianceCenter;
