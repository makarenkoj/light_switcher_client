import SignUpForm from '../forms/signUpForm';
import LoginForm from '../forms/loginForm';
import TelegramButton from '../buttons/telegramButton';
import LogoutButton from '../buttons/logoutButton';
import UserInfo from '../user/user';
import UpdateUserButton from '../buttons/updateUserButton';
import DeviceList from '../deviceList/DeviceList';
import CreateDeviceForm from '../forms/createDeviceForm';
// import TriggersButton from '../buttons/triggersButton';
import Triggers from '../triggers/triggers';
import AddDevice from '../buttons/addDevice';
import AddTriggerButton from '../buttons/addTriggerButton';

// MUI
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import React, { useState, useEffect } from 'react';
import {
  AppBar,
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const theme = useTheme();

  const handleOnDeviceAdded = () => {
    // onDeviceAdded(); /////////
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
                <AddTriggerButton />
                <AddDevice onDeviceAdded={handleOnDeviceAdded} />
                <TelegramButton />
                <UpdateUserButton  handleUserDeleted={handleUserDeleted}/>
                <LogoutButton onLogout={handleLogout} />
              </Box>
              </>
            ) : (
              <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleLoginOpen}>Login</Button>
                <Button variant="contained" color="secondary" onClick={handleRegisterOpen}>Register</Button>
              </Box>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container sx={{ mt: 4, minHeight: 'calc(100vh - 200px)' }}>
          {/* User information section */}
          {isLoggedIn ? (
            <>
            {/* Info Section */}
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

            <UserInfo />
            <Triggers />

            {/* device list */}
            <DeviceList onDeviceAdded={handleOnDeviceAdded}/>
            </>) : null}

            <CreateDeviceForm/>

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
