import { useState } from 'react';
import useTelegramService from '../../services/telegramService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService from '../../services/LocalStorageService';


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const TelegramForm = ({ open, onClose }) => {
  const [telegramForm, setTelegramForm] = useState({ code: '' });
  const [message, setMessage] = useState('');
  const { sendCodeRequest, loading, error } = useTelegramService();
  const localStorageService = new LocalStorageService();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTelegramForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const phoneNumber = localStorageService.getItem('phoneNumber');
      const phoneCodeHash = localStorageService.getItem('phoneCodeHash');
      const token = localStorageService.getItem('token');
      const response = await sendCodeRequest(token, telegramForm.code, phoneNumber, phoneCodeHash);

      localStorageService.setItem('authorized', response.authorized);
      setMessage(response.message);
      onClose();
    } catch (error) {
      console.log('Error:', error.message);
      setMessage(error.message);
    }
  };

  const content =  <>
                  <DialogTitle>Enter Telegram SMS Code</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please enter your Telegram code to activate the service.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="SMS Code"
                      type="code"
                      fullWidth
                      name="code"
                      value={telegramForm.code}
                      onChange={handleChange}
                    />
                    <DialogContentText style={{ color: 'red', marginTop: '10px' }}>
                      {message}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!telegramForm.code}>
                      Submit
                    </Button>
                  </DialogActions>
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

export default TelegramForm;