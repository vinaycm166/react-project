import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  Assessment as ReportIcon,
  PlayArrow as RunIcon
} from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import { fetchReports } from '../../store/slices/reportSlice';
import { fetchRequests } from '../../store/slices/procurementSlice';
import { fetchVendors } from '../../store/slices/vendorSlice';

const ReportingCenter = () => {
  const dispatch = useDispatch();

  const { savedReports, loading } = useSelector((state) => state.reports);
  const { requests } = useSelector((state) => state.procurement);
  const { vendors } = useSelector((state) => state.vendors);

  const [reportType, setReportType] = useState('Procurement');
  const [minRisk, setMinRisk] = useState('All');
  const [generatedData, setGeneratedData] = useState([]);
  const [generatedColumns, setGeneratedColumns] = useState([]);

  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchRequests());
    dispatch(fetchVendors());
  }, [dispatch]);

  if (loading && savedReports.length === 0) {
    return <Loader message="Accessing corporate saved reports registry..." />;
  }

  const handleRunReport = () => {
    let data = [];
    let cols = [];

    if (reportType === 'Procurement') {
      data = requests.filter(r => minRisk === 'All' || r.riskRating === minRisk);
      cols = [
        { field: 'id', headerName: 'Request ID' },
        { field: 'title', headerName: 'Title' },
        { field: 'department', headerName: 'Department' },
        { field: 'vendorName', headerName: 'Vendor Name' },
        { field: 'amount', headerName: 'Amount', renderCell: (row) => `$${row.amount}` },
        { field: 'riskRating', headerName: 'Risk Rating' },
        { field: 'status', headerName: 'Status' }
      ];
    } else if (reportType === 'Vendor') {
      data = vendors.filter(v => minRisk === 'All' || v.riskRating === minRisk);
      cols = [
        { field: 'id', headerName: 'Vendor ID' },
        { field: 'name', headerName: 'Vendor Name' },
        { field: 'riskScore', headerName: 'Risk Score' },
        { field: 'riskRating', headerName: 'Risk Rating' },
        { field: 'certificationStatus', headerName: 'Cert Status' },
        { field: 'activeContractsCount', headerName: 'Contracts Count' }
      ];
    } else if (reportType === 'Risk') {
      data = vendors
        .filter(v => v.riskRating === 'High' || v.riskRating === 'Critical')
        .map(v => ({ id: v.id, name: v.name, riskScore: v.riskScore, riskRating: v.riskRating, status: v.certificationStatus }));
      cols = [
        { field: 'id', headerName: 'Vendor ID' },
        { field: 'name', headerName: 'Vendor Name' },
        { field: 'riskScore', headerName: 'Risk Score' },
        { field: 'riskRating', headerName: 'Risk Level' },
        { field: 'status', headerName: 'Cert Status' }
      ];
    } else if (reportType === 'Compliance') {
      data = vendors
        .filter(v => v.certificationStatus === 'Expired' || v.certificationStatus === 'Suspended')
        .map(v => ({ id: v.id, name: v.name, status: v.certificationStatus, stability: v.financialStability }));
      cols = [
        { field: 'id', headerName: 'Vendor ID' },
        { field: 'name', headerName: 'Vendor Name' },
        { field: 'status', headerName: 'Violation Status' },
        { field: 'stability', headerName: 'Financial Stability' }
      ];
    }

    setGeneratedData(data);
    setGeneratedColumns(cols);
  };

  const handleLoadSaved = (report) => {
    setReportType(report.category);
    setMinRisk(report.filters.minRiskRating || 'All');
    // Automating run on load click
    setTimeout(() => {
      handleRunReport();
    }, 100);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Reporting Center</Typography>
        <Typography variant="body2" color="text.secondary">Generate compliance indexes, vendor directories, and procurement spend reports.</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Saved Templates Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReportIcon color="primary" /> Saved Report Templates
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Click a template to populate the generator parameters:
              </Typography>
              <List>
                {savedReports.map((report, idx) => (
                  <React.Fragment key={report.id}>
                    <ListItem
                      alignItems="flex-start"
                      button="true"
                      onClick={() => handleLoadSaved(report)}
                      sx={{ px: 0, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <ListItemText
                        primary={report.name}
                        secondary={`Category: ${report.category} | Created by: ${report.createdBy}`}
                        primaryTypographyProps={{ variant: 'subtitle2', color: 'primary' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    {idx < savedReports.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Report Run Configuration */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%', boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Report Generator Engine
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                Configure parameters and click compile to extract spreadsheets:
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Report Category</InputLabel>
                    <Select value={reportType} label="Report Category" onChange={(e) => setReportType(e.target.value)}>
                      <MenuItem value="Procurement">Procurement Spend Report</MenuItem>
                      <MenuItem value="Vendor">Vendor Certification Profile</MenuItem>
                      <MenuItem value="Risk">Risk Exposure Summary</MenuItem>
                      <MenuItem value="Compliance">Compliance Violations Index</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Risk Filter</InputLabel>
                    <Select value={minRisk} label="Risk Filter" onChange={(e) => setMinRisk(e.target.value)}>
                      <MenuItem value="All">All Risk Ratings</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button variant="contained" startIcon={<RunIcon />} onClick={handleRunReport}>
                Compile Report Data
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Generated Report Output Grid */}
      {generatedData.length > 0 && (
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Compiled Report Output ({generatedData.length} records)
            </Typography>
            <DataTable columns={generatedColumns} data={generatedData} title={`${reportType}_Report`} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ReportingCenter;
