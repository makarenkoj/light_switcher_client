import SignUpForm from '../forms/signUpForm';
import LoginForm from '../forms/loginForm';
import TelegramButton from '../buttons/telegramButton';
import LogoutButton from '../buttons/logoutButton';
import UserInfo from '../user/user';
import DeviceList from '../deviceList/DeviceList';
import Triggers from '../triggers/triggers';
import { useTranslation } from 'react-i18next';
import '../../i18n';

// MUI
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
  Tooltip,
} from '@mui/material';
import { Brightness4, Brightness7, Warning, Home } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import io from "socket.io-client";
import { useAuth } from '../../context/AuthContext';

const socket = io(import.meta.env.VITE_API_URL);

const App = () => {
  const { user, login, logout, isAdmin, isLoggedIn } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [reconnectTimer, setReconnectTimer] = useState(null);
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleLoginOpen = () => setIsLoginOpen(true);
  const handleLoginClose = () => setIsLoginOpen(false);
  const handleRegisterOpen = () => setIsRegisterOpen(true);
  const handleRegisterClose = () => setIsRegisterOpen(false);

  const handleLoginSuccess = (userData) => {
    if (login) {
      login(userData);
    }
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  const handleUserDeleted = () => {
    if (logout) {
      logout();
    }
  };

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
              {t('dashboard')}
            </Typography>
            {isLoggedIn ? (
              <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {isAdmin && <TelegramButton />}
                <LogoutButton onLogout={handleLogout} />
                <Box>
                  <Tooltip title="English">
                    <IconButton onClick={() => i18n.changeLanguage('en')}>
                      <span role="img" aria-label="English">🇬🇧</span>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Ukrainian">
                    <IconButton onClick={() => i18n.changeLanguage('ua')}>
                      <span role="img" aria-label="Ukrainian">🇺🇦</span>
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              </>
            ) : (
              <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleLoginOpen}>{t('login')}</Button>
                <Button variant="contained" color="secondary" onClick={handleRegisterOpen}>{t('register')}</Button>
                <Box>
                  <Tooltip title="English">
                    <IconButton onClick={() => i18n.changeLanguage('en')}>
                      <span role="img" aria-label="English">🇬🇧</span>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Ukrainian">
                    <IconButton onClick={() => i18n.changeLanguage('ua')}>
                      <span role="img" aria-label="Ukrainian">🇺🇦</span>
                    </IconButton>
                  </Tooltip>
                </Box>
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
                <Home sx={{ mr: 1 }} /> {t('electricity')}: {Math.random() > 0.5 ? 'Available' : 'Not Available'}
              </Typography>
              <Typography variant="body1" display="flex" alignItems="center">
                <Warning sx={{ mr: 1, color: 'red' }} /> {t('alarm')}: {Math.random() > 0.5 ? 'Active' : 'Inactive'}
              </Typography>
              <Typography variant="body1" display="flex" alignItems="center">
                {new Date().getHours() >= 6 && new Date().getHours() <= 18 ? (
                  <Brightness7 sx={{ mr: 1 }} />
                ) : (
                  <Brightness4 sx={{ mr: 1 }} />
                )}
                {new Date().getHours() >= 6 && new Date().getHours() <= 18
                  ? t('daytime')
                  : t('nighttime')}
              </Typography>
            </Box>

            <Tabs value={tabIndex} onChange={handleTabChange} centered>
              <Tab label={t('tab.general')} />
              <Tab label={t('tab.user_info')} />
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
              &copy; {t('logo', {date: (new Date().getFullYear())})}
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

      <LoginForm open={isLoginOpen} onClose={handleLoginClose} onLoginSuccess={handleLoginSuccess} />
      <SignUpForm open={isRegisterOpen} onClose={handleRegisterClose} onSignUpSuccess={handleLoginSuccess}/>
    </>
  );
};

export default App;
