import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  People,
  Warning,
  VerifiedUser,
  History,
  Assessment,
  Settings,
  Logout as LogoutIcon,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/uiSlice';

const DRAWER_WIDTH = 220;

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { themeMode } = useSelector((state) => state.ui);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const navItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { text: 'Procurement', path: '/procurement', icon: <Assignment /> },
    { text: 'Vendors', path: '/vendors', icon: <People /> },
    { text: 'Risk Center', path: '/risk', icon: <Warning /> },
    { text: 'Compliance', path: '/compliance', icon: <VerifiedUser /> },
    { text: 'Audit', path: '/audit', icon: <History /> },
    { text: 'Reports', path: '/reports', icon: <Assessment /> },
    { text: 'Settings', path: '/settings', icon: <Settings /> }
  ];

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: '#1a73e8' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            e-GRCP Platform
          </Typography>
          <IconButton color="inherit" onClick={() => dispatch(toggleTheme())} sx={{ mr: 1 }}>
            {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#e8f0fe', color: '#1a73e8', fontSize: 14 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" fontWeight="bold">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
              <Settings fontSize="small" sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', py: 1 }}>
          <List disablePadding>
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={active}
                    sx={{
                      mx: 1,
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: '#e8f0fe',
                        color: '#1a73e8',
                        '& .MuiListItemIcon-root': { color: '#1a73e8' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
