import { useState } from 'react';
import useUserService from '../../services/userService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, {JWT_TOKEN, USER_ID} from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UserForm = ({ open, onClose, onUserDeleted, userData }) => {
  const [form, setForm] = useState({ email: '', password: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const { updateUserRequest, deleteUserRequest, loading, error } = useUserService();
  const localStorageService = new LocalStorageService();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorageService.getItem(JWT_TOKEN);
      const id = localStorageService.getItem(USER_ID);
      const response = await deleteUserRequest(id, token);

      setMessage(response.message);
      localStorageService.clear();
      onUserDeleted();
      onClose();
    } catch (error) {
      console.log(t('errors.error', {error: error.message}));
      setMessage(error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorageService.getItem(JWT_TOKEN);
      const id = localStorageService.getItem(USER_ID);
      const response = await updateUserRequest(id, token, form.email, form.password, form.phoneNumber);

      setMessage(response.message);
      handleClose();
    } catch (error) {
      console.log(t('errors.error', {error: error.message}));
      setMessage(error.message);
    }
  };

  const handleClose = () => {
    setForm({ email: '', password: '', phoneNumber: '' });
    setMessage('');
    onClose();
  }

  const content = <>
                    <DialogTitle>{t('form.update_account')}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {t('form.update_account_title')}
                      </DialogContentText>

                      <FormControl fullWidth margin="dense" variant="outlined">
                        <InputLabel htmlFor="email">{t('email')}</InputLabel>
                        <OutlinedInput
                          id="email"
                          name="email"
                          type="email"
                          placeholder={userData.email}
                          value={form.email}
                          onChange={handleChange}
                          label={t('email')}
                        />
                      </FormControl>

                      <FormControl fullWidth margin="dense" variant="outlined">
                        <InputLabel htmlFor="phoneNumber">{t('phone_number')}</InputLabel>
                        <OutlinedInput
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder={userData.phoneNumber}
                          value={form.phoneNumber}
                          onChange={handleChange}
                          label={t('phone_number')}
                        />
                      </FormControl>

                      <FormControl fullWidth margin="dense" variant="outlined">
                        <InputLabel htmlFor="password">{t('password')}</InputLabel>
                        <OutlinedInput
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="**********"
                          value={form.password}
                          onChange={handleChange}
                          label={t('password')}
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
                        />
                      </FormControl>
                    </DialogContent>

                    <DialogActions>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }} title={error || t('form.delete_account')}>
                        <IconButton aria-label="delete" size="large">
                          <DeleteIcon fontSize="inherit" onClick={handleDelete} />
                        </IconButton>
                      </Stack>

                      <Button onClick={handleClose}>{t('cancel')}</Button>
                      <Button onClick={handleSubmit}>{t('form.account_update')}</Button>
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
  )
}

export default UserForm;