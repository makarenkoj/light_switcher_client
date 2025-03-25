import { useState } from 'react';
import CreateDeviceForm from '../forms/createDeviceForm';
import { useTranslation } from 'react-i18next';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Button, Tooltip} from '@mui/material';
import { Stack } from '@mui/system';

const defaultContrastThresholdTheme = createTheme({});

export default function AddDevice({ onDeviceAdded }) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const { t } = useTranslation();

  const handleClick = async () => {
    setIsCreateFormOpen(true);
  }

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  return (
    <>
      <ThemeProvider theme={defaultContrastThresholdTheme}>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Tooltip title={t('device.add_device_title')}>
            <Stack direction="row" sx={{ gap: 1 }}>
              <Button variant="contained" color="warning" onClick={handleClick}>
                {t('device.add_device')}
              </Button>
            </Stack>
          </Tooltip>
        </Stack>
      </ThemeProvider>

      <CreateDeviceForm
        open={isCreateFormOpen}
        onClose={handleCloseCreateForm}
        onDeviceAdded={onDeviceAdded} />
    </>
  );
}
