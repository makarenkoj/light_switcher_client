import { useState } from 'react';
import { Button } from '@mui/material';
import CreateTelegramDataForm from '../forms/createTelegramDataForm';

const OpenTelegramFormButton = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Додати Telegram Data
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
