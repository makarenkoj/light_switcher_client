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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      setError(t('errors.telegram.telegram_create', {error: err.message}));
      console.error(error);
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
      <DialogTitle>{t('telegram.create_telegram_credentials')}</DialogTitle>
      <DialogContent>
        {error && <ErrorMessage message={error} />}
        <DialogContentText style={{ color: 'red', marginTop: '10px', padding: '0 24px' }}>
          {message}
        </DialogContentText>
        <TextField
          fullWidth
          margin="normal"
          label={t('api_id')}
          value={apiId}
          onChange={(e) => setApiId(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label={t('api_hash')}
          value={apiHash}
          onChange={(e) => setApiHash(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label={t('channel')}
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTelegramDataForm;
