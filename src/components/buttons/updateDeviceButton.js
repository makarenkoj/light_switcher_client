import { useState } from 'react';
import UpdateDeviceForm from '../forms/updateDeviceForm';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';

const defaultContrastThresholdTheme = createTheme({});

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
      <Stack direction="row" sx={{ gap: 4 }} mt={2}>
        <ThemeProvider theme={defaultContrastThresholdTheme}>
          <Stack sx={{ gap: 1, alignItems: 'center' }}>
            <Stack direction="row" sx={{ gap: 1 }}>
              <Button variant="contained" color="secondary" onClick={handleClick}>
                Update Device
              </Button>
            </Stack>
          </Stack>
        </ThemeProvider>
      </Stack>

      <UpdateDeviceForm
        open={isUpdateFormOpen}
        onClose={handleCloseUpdateForm}
        onDeviceUpdated={onDeviceUpdated}
        device={device} />
    </>
  );
}