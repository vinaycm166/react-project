import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, CircularProgress, Link, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { authService } from '../../services/authService';

const schema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required').min(4, 'At least 4 characters'),
  password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
  role: yup.string().required('Role is required')
});

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'Employee' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(data.name, data.email, data.username, data.password, data.role);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Card sx={{ width: 420, p: 1 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Create Account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Register for the e-GRCP Platform
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 2 }}>Registered! Redirecting to login...</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Full Name" fullWidth size="small"
              error={!!errors.name} helperText={errors.name?.message}
              {...register('name')} />

            <TextField label="Email" type="email" fullWidth size="small"
              error={!!errors.email} helperText={errors.email?.message}
              {...register('email')} />

            <TextField label="Username" fullWidth size="small"
              error={!!errors.username} helperText={errors.username?.message}
              {...register('username')} />

            <TextField label="Password" type="password" fullWidth size="small"
              error={!!errors.password} helperText={errors.password?.message}
              {...register('password')} />

            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select defaultValue="Employee" label="Role" {...register('role')}>
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Procurement Manager">Procurement Manager</MenuItem>
                <MenuItem value="Compliance Officer">Compliance Officer</MenuItem>
                <MenuItem value="Auditor">Auditor</MenuItem>
                <MenuItem value="Administrator">Administrator</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Register'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component="button" variant="body2" onClick={() => navigate('/login')}>
              Already have an account? Login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
