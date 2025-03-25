import { useState } from 'react';
import { Button } from '@mui/material';
import CreateTelegramDataForm from '../forms/createTelegramDataForm';
import { useTranslation } from 'react-i18next';

const OpenTelegramFormButton = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        {t('telegram.add_telegram_keys')}
      </Button>
      <CreateTelegramDataForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default OpenTelegramFormButton;
