import React, { useState } from 'react';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
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

const SignUpForm = ({ open, onClose }) => {
  const { registrationRequest, loading, error } = useRegistrationService();
  const [form, setForm] = useState({ email: '', password: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const localStorageService = new LocalStorageService();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registrationRequest(form.email, form.password, form.phoneNumber);

      localStorageService.setItem(JWT_TOKEN, response.token);
      setMessage(response.message);
      onClose();
    }catch (error) {
      localStorageService.clear();
      console.error('Login error:', error.message);
      // alert(error.message);
      setMessage('Login failed: ' + error.message);
    }
  };

  const content =  <>
                  <DialogTitle>Register</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please fill out the form below to create a new account.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Email"
                      type="email"
                      fullWidth
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="dense"
                      label="Password"
                      type="password"
                      fullWidth
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="dense"
                      label="Phone Number"
                      type="tel"
                      fullWidth
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleSubmit}>Submit</Button>
                  </DialogActions>
                  {message && (
                    <DialogContentText style={{ color: message.includes('failed') ? 'red' : 'green', marginTop: '10px' }}>
                      {message}
                    </DialogContentText>
                  )}
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
};

export default SignUpForm;
