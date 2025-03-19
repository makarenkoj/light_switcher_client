import SignUpForm from '../forms/signUpForm';
import LoginForm from '../forms/loginForm';
import TelegramButton from '../buttons/telegramButton';
import LogoutButton from '../buttons/logoutButton';
import UserInfo from '../user/user';
import DeviceList from '../deviceList/DeviceList';
import Triggers from '../triggers/triggers';
// import { useTranslation } from 'react-i18next';
// import '../../i18n';

// MUI
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Box,
} from '@mui/material';
import { Brightness4, Brightness7, Warning, Home } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [reconnectTimer, setReconnectTimer] = useState(null);
  const theme = useTheme();
  // const { i18n } = useTranslation();

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleLoginOpen = () => setIsLoginOpen(true);
  const handleLoginClose = () => setIsLoginOpen(false);
  const handleRegisterOpen = () => setIsRegisterOpen(true);
  const handleRegisterClose = () => setIsRegisterOpen(false);
  const handleLogout = () =>  setIsLoggedIn(false);
  const handleUserDeleted = () => setIsLoggedIn(false);
  
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);

  useEffect(() => {
    setIsLoggedIn(token ? true : false);
  }, [token]);

  useEffect(() => {
    socket.on('connect', () => {
      clearTimeout(reconnectTimer);
      setReconnectTimer(null);
    });

    socket.on('disconnect', () => {
      if (!reconnectTimer) {
          const timer = setTimeout(() => {
              window.location.reload();
          }, 15000);
          setReconnectTimer(timer);
      }
    });

    socket.on('serverStarted', ({ message }) => {
        window.location.reload();
    });

    return () => {
        socket.off('serverStarted');
        socket.off('connect');
        socket.off('disconnect');
        clearTimeout(reconnectTimer);
    };
  }, [reconnectTimer]);

  return (
    <>
      <AppProvider theme={theme} >

        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Home Dashboard
            </Typography>
            {isLoggedIn ? (
              <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TelegramButton />
                <LogoutButton onLogout={handleLogout} />
                {/* <button onClick={() => i18n.changeLanguage('en')}>🇬🇧 English</button>
                <button onClick={() => i18n.changeLanguage('uk')}>🇺🇦 Українська</button> */}
              </Box>
              </>
            ) : (
              <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleLoginOpen}>Login</Button>
                <Button variant="contained" color="secondary" onClick={handleRegisterOpen}>Register</Button>
                {/* <button onClick={() => i18n.changeLanguage('en')}>🇬🇧 English</button>
                <button onClick={() => i18n.changeLanguage('uk')}>🇺🇦 Українська</button> */}
              </Box>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4, minHeight: 'calc(100vh - 200px)' }} >
          {isLoggedIn ? (
            <>
            <Box mt={4} display="flex" justifyContent="space-around">
              <Typography variant="body1" display="flex" alignItems="center">
                <Home sx={{ mr: 1 }} /> Electricity: {Math.random() > 0.5 ? 'Available' : 'Not Available'}
              </Typography>
              <Typography variant="body1" display="flex" alignItems="center">
                <Warning sx={{ mr: 1, color: 'red' }} /> Alarm: {Math.random() > 0.5 ? 'Active' : 'Inactive'}
              </Typography>
              <Typography variant="body1" display="flex" alignItems="center">
                {new Date().getHours() >= 6 && new Date().getHours() <= 18 ? (
                  <Brightness7 sx={{ mr: 1 }} />
                ) : (
                  <Brightness4 sx={{ mr: 1 }} />
                )}
                {new Date().getHours() >= 6 && new Date().getHours() <= 18
                  ? 'Daytime'
                  : 'Nighttime'}
              </Typography>
            </Box>

            <Tabs value={tabIndex} onChange={handleTabChange} centered>
              <Tab label="General" />
              <Tab label="User info" />
            </Tabs>

            {tabIndex === 0 && (
              <Box mt={4} p={3} textAlign="center" bgcolor="grey.100"  borderRadius={2}>
                <Triggers />
                <DeviceList />
              </Box>
            )}
            {tabIndex === 1 && (
              <Box mt={4} p={3} textAlign="center" bgcolor="grey.100"  borderRadius={2}>
                <UserInfo handleUserDeleted={handleUserDeleted}/>
              </Box>
            )}
            </>) : null}

        </Container>
        {/* Footer */}
        <Box mt={4} py={2} bgcolor="grey.200" position="relative" bottom="0" width="100%">
          <Container>
            <Typography variant="body2" align="center">
              &copy; 2025 Smart Home. All rights reserved.
            </Typography>
            <Box mt={2} display="flex" justifyContent="center">
              <IconButton href="#" color="primary" >
                <i className="fab fa-facebook"></i>
              </IconButton>
              <IconButton href="#" color="primary">
                <i className="fab fa-twitter"></i>
              </IconButton>
              <IconButton href="#" color="primary">
                <i className="fab fa-instagram"></i>
              </IconButton>
            </Box>
          </Container>
        </Box>
      </AppProvider>

      {/* Login Dialog */}
      <LoginForm open={isLoginOpen} onClose={handleLoginClose} />

      {/* Реєстрація */}
      <SignUpForm open={isRegisterOpen} onClose={handleRegisterClose} />
    </>
  );
};

export default App;
