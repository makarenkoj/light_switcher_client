import { useState } from 'react';
import { Button } from '@mui/material';
import CreateDeviceTriggerForm from '../forms/createDeviceTriggerForm';

const AddDeviceTriggerButton = ({ deviceId, onTriggerAdded }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="contained" color="secondary" onClick={() => setIsOpen(true)}>
        Додати тригер
      </Button>
      <CreateDeviceTriggerForm
        open={isOpen}
        onClose={() => setIsOpen(false)}
        deviceId={deviceId}
        onTriggerAdded={onTriggerAdded}
      />
      
    </>
  );
};

export default AddDeviceTriggerButton;
