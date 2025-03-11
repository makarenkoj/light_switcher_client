import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useTelegramService from '../../services/telegramService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';

const CreateTelegramDataForm = ({ open, onClose, onSubmit }) => {
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [channel, setChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const localStorageService = useMemo(() => new LocalStorageService(), []);
  const token = useMemo(() => localStorageService.getItem(JWT_TOKEN), [localStorageService]);
  const { createTelegramData } = useTelegramService();
  const resetForm = () => {
    setApiId('');
    setApiHash('');
    setChannel('');
    setLoading(false);
    setError(null);
    setMessage('');
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createTelegramData(token, apiId, apiHash, channel);
      setMessage(response.message);
      onSubmit(message);
      onClose();
    } catch (err) {
      setMessage(err.message);
      setError(err.message || 'Error creating Telegram Data');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <IconButton
          aria-label="close"
          onClick={onClose}
            sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
        <CloseIcon />
      </IconButton>
      <DialogTitle>Create Telegram Data</DialogTitle>
      <DialogContent>
        {error && <ErrorMessage message={error} />}
        <DialogContentText style={{ color: 'red', marginTop: '10px' }}>
          {message} 
        </DialogContentText>
        <TextField
          fullWidth
          margin="normal"
          label="API ID"
          value={apiId}
          onChange={(e) => setApiId(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="API Hash"
          value={apiHash}
          onChange={(e) => setApiHash(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Канал"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Створити'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTelegramDataForm;
