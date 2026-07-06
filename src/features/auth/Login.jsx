import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, CircularProgress, Link
} from '@mui/material';
import { loginUser } from '../../store/slices/authSlice';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data))
      .unwrap()
      .then(() => navigate('/dashboard'))
      .catch(() => {});
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Card sx={{ width: 400, p: 1 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Sign In</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            e-GRCP Enterprise Platform
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              fullWidth
              size="small"
              error={!!errors.username}
              helperText={errors.username?.message}
              {...register('username')}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Login'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Link component="button" variant="body2" onClick={() => navigate('/forgot-password')}>
              Forgot Password?
            </Link>
            <Link component="button" variant="body2" onClick={() => navigate('/signup')}>
              Sign Up
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
