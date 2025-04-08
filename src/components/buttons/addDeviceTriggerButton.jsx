import { useState } from 'react';
import { Button } from '@mui/material';
import CreateDeviceTriggerForm from '../forms/createDeviceTriggerForm';
import { useTranslation } from 'react-i18next';

const AddDeviceTriggerButton = ({ deviceId, onTriggerAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button variant="contained" color="secondary" onClick={() => setIsOpen(true)}>
        {t('device.add_to_the_device')}
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
