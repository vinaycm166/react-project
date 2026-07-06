import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Alert
} from '@mui/material';
import { toggleTheme } from '../../store/slices/uiSlice';

const UserSettings = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { themeMode } = useSelector((state) => state.ui);

  const [tfa, setTfa] = useState(false);
  const [success, setSuccess] = useState('');

  const handleTfaToggle = () => {
    setTfa(!tfa);
    setSuccess(tfa ? 'Two-Factor Authentication deactivated.' : 'Two-Factor Authentication activated successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">User Settings</Typography>
        <Typography variant="body2" color="text.secondary">Configure themes, notification settings, and secure profile parameters.</Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3, boxShadow: 1 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                {user ? user.name.split(' ').map(n=>n[0]).join('') : 'U'}
              </Avatar>
              <Typography variant="h6" fontWeight="bold">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Privilege Role: {user?.role}
              </Typography>
              <Divider sx={{ width: '100%', my: 2 }} />
              <Box sx={{ width: '100%', textAlign: 'left' }}>
                <Typography variant="caption" color="text.secondary">Email Address</Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1.5 }}>{user?.email}</Typography>
                
                <Typography variant="caption" color="text.secondary">Operational Department</Typography>
                <Typography variant="body2" fontWeight="bold">{user?.department}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Configurations Settings */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 1 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>System Preferences</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={themeMode === 'dark'}
                      onChange={() => dispatch(toggleTheme())}
                    />
                  }
                  label={`Dark Mode Visualization (Currently ${themeMode.toUpperCase()})`}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email System Alerts for Approved Purchases"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Compliance Expired Notifications (Instant Alerts)"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Security Configurations</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, maxWidth: 300 }}>
                <FormControlLabel
                  control={<Switch checked={tfa} onChange={handleTfaToggle} />}
                  label="Activate Two-Factor Authentication (2FA)"
                />
                <Button variant="outlined" color="primary" sx={{ mt: 1 }}>
                  Rotate API Security Token
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserSettings;
