import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Warning as ErrorOutlineIcon } from '@mui/icons-material';

const ErrorState = ({ message = 'An error occurred while loading this view.', onRetry }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2, textAlign: 'center' }}>
      <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
      <Box>
        <Typography variant="h6" color="text.primary" gutterBottom>
          Unable to Load Data
        </Typography>
        <Typography variant="body2" color="text.secondary" maxWidth={400}>
          {message}
        </Typography>
      </Box>
      {onRetry && (
        <Button variant="outlined" color="primary" onClick={onRetry} size="small">
          Retry Action
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
