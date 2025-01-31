import { useState } from 'react';
import useUserService from '../../services/userService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, {JWT_TOKEN, USER_ID} from '../../services/LocalStorageService';

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

const UserForm = ({ open, onClose }) => {
  const [form, setForm] = useState({ email: '', password: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const { updateUserRequest, loading, error } = useUserService();
  const localStorageService = new LocalStorageService();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorageService.getItem(JWT_TOKEN);
      const id = localStorageService.getItem(USER_ID);
      const response = await updateUserRequest(id, token, form.email, form.password, form.phoneNumber);

      setMessage(response.message);
      onClose();
    } catch (error) {
      console.log('Error:', error.message);
      setMessage(error.message);
    }
  };

  const content =  <>
                  <DialogTitle>Update Accaunt</DialogTitle>
                  <DialogContent>
                  <DialogContentText>
                    Please fill out the form below to a update account.
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

                  {/* Delete user button */}
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                    <IconButton aria-label="delete" size="large">
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>

                  {/* <DialogActions> */}
                    <Button onClick={onClose}>Cancel</Button>
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
      {errorMessage}
      {spinner}
      {content}
    </Dialog>
  )
}

export default UserForm;