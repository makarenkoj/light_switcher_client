import { useState } from 'react';
import { Button } from '@mui/material';
import UpdateTelegramForm from '../forms/updateTelegramForm';

const UpdateTelegramButton = ({ telegramData, onUpdate }) => {
  const [open, setOpen] = useState(false);

  const handleCloseForm = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="inherit" size="small" onClick={() => setOpen(true)}>
        Update Data
      </Button>
      <UpdateTelegramForm open={open} onClose={handleCloseForm} onUpdate={onUpdate} telegramData={telegramData} />
    </>
  );
};

export default UpdateTelegramButton;
