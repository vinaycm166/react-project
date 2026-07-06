import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import store, { persistor } from './store';
import AppLayout from './layouts/AppLayout';
import { AuthGuard, GuestGuard, RoleGuard } from './routes/RouteGuards';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';

// Lazy loading feature modules for page performance
const Login = React.lazy(() => import('./features/auth/Login'));
const Signup = React.lazy(() => import('./features/auth/Signup'));
const ForgotPassword = React.lazy(() => import('./features/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./features/auth/ResetPassword'));

const Dashboard = React.lazy(() => import('./features/dashboard/Dashboard'));
const ProcurementList = React.lazy(() => import('./features/procurement/ProcurementList'));
const ProcurementDetail = React.lazy(() => import('./features/procurement/ProcurementDetail'));
const VendorList = React.lazy(() => import('./features/vendors/VendorList'));
const VendorDetail = React.lazy(() => import('./features/vendors/VendorDetail'));
const RiskCenter = React.lazy(() => import('./features/risk/RiskCenter'));
const ComplianceCenter = React.lazy(() => import('./features/compliance/ComplianceCenter'));
const AuditCenter = React.lazy(() => import('./features/audit/AuditCenter'));
const ReportingCenter = React.lazy(() => import('./features/reports/ReportingCenter'));
const UserSettings = React.lazy(() => import('./features/settings/UserSettings'));

const AppContent = () => {
  const { themeMode } = useSelector((state) => state.ui);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: themeMode,
        primary: { main: '#1a73e8' },
        background: {
          default: themeMode === 'light' ? '#f5f5f5' : '#121212',
          paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e'
        }
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      },
      components: {
        MuiCard: {
          defaultProps: { elevation: 1 }
        }
      }
    });
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalErrorBoundary>
        <React.Suspense fallback={<div>Loading view...</div>}>
          <Routes>
            {/* Public Entry Routes */}
            <Route
              path="/login"
              element={
                <GuestGuard>
                  <Login />
                </GuestGuard>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestGuard>
                  <Signup />
                </GuestGuard>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestGuard>
                  <ForgotPassword />
                </GuestGuard>
              }
            />
            <Route
              path="/reset-password"
              element={
                <GuestGuard>
                  <ResetPassword />
                </GuestGuard>
              }
            />

            {/* Protected Routes layout container */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              {/* Nested Child Modules */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="procurement" element={<ProcurementList />} />
              <Route path="procurement/:id" element={<ProcurementDetail />} />
              <Route path="vendors" element={<VendorList />} />
              <Route path="vendors/:id" element={<VendorDetail />} />
              <Route path="risk" element={<RiskCenter />} />
              <Route path="compliance" element={<ComplianceCenter />} />
              <Route path="audit" element={<AuditCenter />} />
              <Route path="reports" element={<ReportingCenter />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>

            {/* Default Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </React.Suspense>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
