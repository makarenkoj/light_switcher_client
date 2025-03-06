import React, { useState } from 'react';
import LocalStorageService, {JWT_TOKEN, USER_ID} from '../../services/LocalStorageService';
import useRegistrationService from '../../services/registrationService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LoginForm = ({ open, onClose}) => {
  const { loginRequest, loading, error } = useRegistrationService();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const localStorageService = new LocalStorageService();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await loginRequest(loginForm.email, loginForm.password);
  
      localStorageService.setItem(JWT_TOKEN, response.token);
      localStorageService.setItem(USER_ID, response.userId);
      setMessage(response.message);
      onClose();
    } catch (error) {
      localStorageService.clear();
      console.error('Login error:', error.message);
      // alert(error.message);
      setMessage('Login failed: ' + error.message);
    }
  };

  const content =  <>
                  <DialogTitle>Login</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please enter your email and password to log in.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Email"
                      type="email"
                      fullWidth
                      name="email"
                      value={loginForm.email}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="dense"
                      label="Password"
                      type="password"
                      fullWidth
                      name="password"
                      value={loginForm.password}
                      onChange={handleChange}
                    />
                    <DialogContentText style={{ color: 'red', marginTop: '10px' }}>
                      {message}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleSubmit} disabled={!loginForm.email || !loginForm.password}>
                      Submit
                    </Button>
                  </DialogActions>
                </>;    

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <Dialog open={open} onClose={onClose}>
      <IconButton
        aria-label="close"
        onClick={() => onClose(onClose)}
                  sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
        >
        <CloseIcon />
      </IconButton>
      {errorMessage}
      {spinner}
      {content}
    </Dialog>
  );
}

export default LoginForm;
