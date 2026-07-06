import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { authService } from '../../services/authService';

const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required')
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authService.forgotPassword(data.email);
      setMessage(res.message);
    } catch (err) {
      setError(err.message || 'Email not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Card sx={{ width: 400, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your registered email to receive a password reset link.
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />
            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 1, py: 1.2 }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Button fullWidth variant="text" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
