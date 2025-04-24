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
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignUpForm = ({ open, onClose, onSignUpSuccess }) => {
  const { registrationRequest, loading, error } = useRegistrationService();
  const [form, setForm] = useState({ email: '', password: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
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

      handleClose();
    }catch (error) {
      localStorageService.clear();
      console.error(t('errors.form.sign_up', {error: error.message}));
      setMessage(t('errors.form.sign_up', {error: error.message}));
    }
  };

  const handleClose = () => {
    setForm({ email: '', password: '', phoneNumber: '' });
    setMessage('');
    onClose();
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  }

  const handleEscapeKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  }

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
                      placeholder={'mail@email.com'}
                      fullWidth
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="dense"
                      label={t('phone_number')}
                      type="tel"
                      placeholder={'+380XX-XXX-XX-XX'}
                      fullWidth
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      onKeyDown={handleKeyPress}
                    />
                    <FormControl fullWidth margin="dense" variant="outlined">
                      <InputLabel htmlFor="password">{t('password')}</InputLabel>
                      <OutlinedInput
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                              aria-label={showPassword ? t('hide_password') : t('show_password')}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label={t('password')}
                      />
                    </FormControl>
                  </DialogContent>
                  <DialogContentText style={{ color: 'red', marginTop: '10px', padding: '0 24px' }}>
                    {message}
                  </DialogContentText>
                  <DialogActions>
                    <Button onClick={handleSubmit}>{t('register')}</Button>
                  </DialogActions>
                </>;  

  const errorMessage = error ? <ErrorMessage message={error}/> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus={true} onKeyDown={handleEscapeKeyDown}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
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
