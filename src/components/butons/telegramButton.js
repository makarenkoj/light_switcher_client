import { useState, useEffect } from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import useTelegramService from '../../services/telegramService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import TelegramForm from '../forms/telegramForm';


const TelegramButton = ({ onPasswordRequest }) => {
  const [status, setStatus] = useState(false);
  const [isTelegramFormOpen, setIsTelegramFormOpen] = useState(false);
  const { getTelegramStatus, codeRequest, loading, error } = useTelegramService();

  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);

  const handleClick = async (e) => {
    e.preventDefault();

    if (status) return;

    try {
      const response = await codeRequest(token);
      console.log('Response:', response);

      if (response.authorized) {
        localStorage.setItem('authorized', response.authorized);
        setStatus(true);
        return;
      }

      localStorage.setItem('phoneNumber', response.phoneNumber);
      localStorage.setItem('phoneCodeHash',response.phoneCodeHash);
      setIsTelegramFormOpen(true);
    } catch (error) {
      localStorage.removeItem('phoneNumber');
      localStorage.removeItem('phoneCodeHash');
      console.log('Error:', error.message);
      console.log('Error:', error);
    }
  };

  // useEffect(() => {
  //   const handleStatus = async () => {
  //     try {
  //       const response = await getTelegramStatus(token);
  //       setStatus(response.authorized);
  //     } catch (error) {
  //       console.error('Error fetching Telegram status:', error.message);
  //     }
  //   };
  
  //   handleStatus();
  //   }, [token, status, getTelegramStatus]);


  return (
    <>
    <Tooltip title={error || (status ? 'Telegram is active' : 'Telegram is inactive')}>
      <span>
        <Button
          variant="contained"
          color={status ? 'success' : 'error'}
          onClick={handleClick}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : status ? <CheckCircle /> : <Cancel />}
        >
          Telegram {status ? 'On' : 'Off'}
        </Button>
      </span>
    </Tooltip>

    {/* Telegram Password Form */}
          <TelegramForm
            open={isTelegramFormOpen}
            onClose={() => setIsTelegramFormOpen(false)}
            // onSubmit={console.log('Submit')}
          />
    </>
  );
};

export default TelegramButton;
