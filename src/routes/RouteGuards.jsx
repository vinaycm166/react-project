import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';

export const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const GuestGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const RoleGuard = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You do not have the required permissions to view this module.
        </Typography>
        <Button variant="contained" href="/dashboard">
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  return children;
};
