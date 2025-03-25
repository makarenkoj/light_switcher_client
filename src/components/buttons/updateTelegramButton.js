import { useState } from 'react';
import { Button } from '@mui/material';
import UpdateTelegramForm from '../forms/updateTelegramForm';
import { useTranslation } from 'react-i18next';

const UpdateTelegramButton = ({ telegramData, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleCloseForm = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="inherit" size="small" onClick={() => setOpen(true)}>
        {t('telegram.update_telegram_credentials')}
      </Button>
      <UpdateTelegramForm open={open} onClose={handleCloseForm} onUpdate={onUpdate} telegramData={telegramData} />
    </>
  );
};

export default UpdateTelegramButton;
