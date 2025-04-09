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
import { useTranslation } from 'react-i18next';

const LoginForm = ({ open, onClose, onLoginSuccess}) => {
  const { loginRequest, loading, error } = useRegistrationService();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const localStorageService = new LocalStorageService();
  const { t } = useTranslation();

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
  
      if (onLoginSuccess) {
        onLoginSuccess({ id: response.userId, token: response.token });
      }
      onClose();
    } catch (error) {
      localStorageService.clear();
      console.error(t('errors.form.login_error', {error: error.message}));
      setMessage(t('errors.form.login_error', {error: error.message}));
    }
  };

  const content =  <>
                  <DialogTitle>{t('form.login')}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {t('form.login_enter')}
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      label={t('form.email')}
                      type="email"
                      fullWidth
                      name="email"
                      value={loginForm.email}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="dense"
                      label={t('form.password')}
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
                      {t('form.submit')}
                    </Button>
                  </DialogActions>
                </>;    

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus={true}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute',
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
