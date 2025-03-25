import { useState, useMemo } from 'react';
import { Box, TextField, Button, Dialog, IconButton, DialogContent, DialogContentText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useTelegramService from '../../services/telegramService';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

const UpdateTelegramForm = ({ telegramData, open, onClose, onUpdate }) => {
  const { updateTelegramData } = useTelegramService();
  const [formData, setFormData] = useState({ apiId: '', apiHash: '', channel: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const localStorageService = useMemo(() => new LocalStorageService(), []);
  const token = useMemo(() => localStorageService.getItem(JWT_TOKEN), [localStorageService]);
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearForm =() => {
    setFormData({ apiId: '', apiHash: '', channel: '' });
    setMessage('');
    onUpdate();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiId = formData.apiId || '';
    const apiHash = formData.apiHash || '';
    const channel = formData.channel || '';

    try {
      const response = await updateTelegramData(token, apiId, apiHash, channel);
      console.log('update:', response);
      setMessage(response.message);
      clearForm();
    } catch (error) {
      setMessage(error.message);
      console.error(t('errors.telegram.update_credentials', {error: error.message}));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <IconButton
        aria-label="close"
        onClick={clearForm}
        sx={{
          position: 'absolute',
          right: 1,
          top: 1,
          color: (theme) => theme.palette.grey[500],
          }}
          >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '35px'  }} >
        <DialogContentText style={{ color: 'red', marginTop: '5px' }}>
          {message}
        </DialogContentText>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label={t("api_id")} name="apiId" value={formData.apiId} onChange={handleChange} placeholder={telegramData.apiId}/>
          <TextField label={t('api_hash')} name="apiHash" value={formData.apiHash} onChange={handleChange} placeholder={telegramData.apiHash}/>
          <TextField label={t('channel')} name="channel" value={formData.channel} onChange={handleChange} placeholder={telegramData.channel}/>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTelegramForm;
