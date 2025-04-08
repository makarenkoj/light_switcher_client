import { useState, useEffect } from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import useTelegramService from '../../services/telegramService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import TelegramForm from '../forms/telegramForm';
import { useTranslation } from 'react-i18next';

const TelegramButton = ({ onPasswordRequest }) => {
  const [status, setStatus] = useState(false);
  const [isTelegramFormOpen, setIsTelegramFormOpen] = useState(false);
  const { getTelegramStatus, codeRequest, loading, error } = useTelegramService();
  const { t } = useTranslation();
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);

  const handleClick = async (e) => {
    e.preventDefault();

    if (status) return;

    try {
      const response = await codeRequest(token);

      if (response.authorized) {
        localStorageService.setItem('authorized', response.authorized);
        setStatus(true);
        return;
      }

      localStorageService.setItem('phoneNumber', response.phoneNumber);
      localStorageService.setItem('phoneCodeHash',response.phoneCodeHash);
      setIsTelegramFormOpen(true);
    } catch (error) {
      console.error(t('errors.error', {error: error.message}));
    }
  };

  useEffect(() => {
    const handleStatus = async () => {
      try {
        const response = await getTelegramStatus(token);
        setStatus(response.authorized);
      } catch (error) {
        console.error(t('errors.telegram.telegram_status', {error: error.message}));
      }
    };

    handleStatus();

    // eslint-disable-next-line
  }, []);

  return (
    <>
    <Tooltip title={error || (status ? t('telegram.telegram_active') : t('telegram.telegram_inactive'))}>
      <span>
        <Button
          variant="contained"
          color={status ? 'success' : 'error'}
          onClick={handleClick}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : status ? <CheckCircle /> : <Cancel />}
        >
          {t('telegram.telegram')} {status ? t('on') : t('off')}
        </Button>
      </span>
    </Tooltip>

    <TelegramForm
      open={isTelegramFormOpen}
      onClose={() => setIsTelegramFormOpen(false)}
    />
    </>
  );
};

export default TelegramButton;
