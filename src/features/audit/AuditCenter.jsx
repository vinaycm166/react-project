import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import { fetchAuditLogs } from '../../store/slices/auditSlice';

const AuditCenter = () => {
  const dispatch = useDispatch();

  const { logs, loading } = useSelector((state) => state.audit);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  if (loading && logs.length === 0) {
    return <Loader message="Accessing secure audit trails database..." />;
  }

  const columns = [
    { field: 'id', headerName: 'Log ID' },
    { field: 'action', headerName: 'Action Event' },
    { field: 'user', headerName: 'Operator' },
    { field: 'date', headerName: 'Timestamp' },
    { field: 'details', headerName: 'Activity Details' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Audit Center</Typography>
        <Typography variant="body2" color="text.secondary">Review chronological system audit trails and user activity registries.</Typography>
      </Box>

      {/* Audit History Logs Table */}
      <DataTable columns={columns} data={logs} title="Enterprise_GRCP_System_Audit_Trail" />
    </Box>
  );
};

export default AuditCenter;
