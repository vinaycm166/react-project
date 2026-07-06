import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
          <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center', border: '1px solid', borderColor: 'divider', boxShadow: 3 }}>
            <Typography variant="h4" color="error" gutterBottom fontWeight="bold">
              Something went wrong.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              An unexpected error occurred in the application rendering engine. Please try returning to the home screen or reloading.
            </Typography>
            {this.state.error && (
              <Typography variant="caption" display="block" sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, textAlign: 'left', mb: 3, overflowX: 'auto', fontFamily: 'monospace' }}>
                {this.state.error.toString()}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={this.handleReset}>
                Go to Dashboard
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
