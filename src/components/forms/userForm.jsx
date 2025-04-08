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
  TextField,
  Button,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const UserForm = ({ open, onClose, onUserDeleted, userData }) => {
  const [form, setForm] = useState({ email: '', password: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
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
      onClose();
    } catch (error) {
      console.log(t('errors.error', {error: error.message}));
      setMessage(error.message);
    }
  };

  const content =  <>
                  <DialogTitle>{t('form.update_account')}</DialogTitle>
                  <DialogContent>
                  <DialogContentText>
                    {t('form.update_account_title')}
                  </DialogContentText>
                  <TextField
                    autoFocus
                    placeholder={userData.email}
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
                    placeholder={'**********'}
                    label={t('password')}
                    type="password"
                    fullWidth
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="dense"
                    placeholder={userData.phoneNumber}
                    label={t('phone_number')}
                    type="tel"
                    fullWidth
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                  </DialogContent>
                  <DialogActions>

                  {/* Delete user button */}
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}  title={error || t('form.delete_account')}>
                    <IconButton aria-label="delete" size="large">
                      <DeleteIcon fontSize="inherit" onClick={handleDelete}/>
                    </IconButton>
                  </Stack>

                  {/* <DialogActions> */}
                    <Button onClick={onClose}>{t('cancel')}</Button>
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
      {errorMessage}
      {spinner}
      {content}
    </Dialog>
  )
}

export default UserForm;