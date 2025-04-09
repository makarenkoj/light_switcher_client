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
import { useTranslation } from 'react-i18next';

const SignUpForm = ({ open, onClose, onSignUpSuccess }) => {
  const { registrationRequest, loading, error } = useRegistrationService();
  const [form, setForm] = useState({ email: '', password: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const localStorageService = new LocalStorageService();
  const { t } = useTranslation();

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

      if (onSignUpSuccess) {
        onSignUpSuccess({ id: response.userId, token: response.token });
      }

      onClose();
    }catch (error) {
      localStorageService.clear();
      console.error(t('errors.form.sign_up', {error: error.message}));
      setMessage(t('errors.form.sign_up', {error: error.message}));
    }
  };

  const content =  <>
                  <DialogTitle>{t('form.register')}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {t('form.register_text')}
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      label={t('email')}
                      type="email"
                      fullWidth
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="dense"
                      label={t('password')}
                      type="password"
                      fullWidth
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="dense"
                      label={t('phone_number')}
                      type="tel"
                      fullWidth
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleSubmit}>{t('register')}</Button>
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
};

export default SignUpForm;
