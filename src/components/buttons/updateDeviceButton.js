import { useState } from 'react';
import UpdateDeviceForm from '../forms/updateDeviceForm';
import {Button, Tooltip} from '@mui/material';
import { Stack } from '@mui/system';

export default function UpdateDeviceButton({ device, onDeviceUpdated }) {
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const handleClick = async () => {
    setIsUpdateFormOpen(true);
  }

  const handleCloseUpdateForm = () => {
    setIsUpdateFormOpen(false);
  };

  return (
    <>
      <Tooltip title='Update Device'>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button size="small" variant="contained" color="secondary" onClick={handleClick}>
              Update Device
            </Button>
          </Stack>
        </Stack>
      </Tooltip>

      <UpdateDeviceForm
        open={isUpdateFormOpen}
        onClose={handleCloseUpdateForm}
        onDeviceUpdated={onDeviceUpdated}
        device={device} />
    </>
  );
}