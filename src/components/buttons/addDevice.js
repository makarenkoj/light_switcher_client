import { useState } from 'react';
import CreateDeviceForm from '../forms/createDeviceForm';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Button, Tooltip} from '@mui/material';
import { Stack } from '@mui/system';

const defaultContrastThresholdTheme = createTheme({});

export default function AddDevice({ onDeviceAdded }) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleClick = async () => {
    setIsCreateFormOpen(true);
  }

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  return (
    <>
      {/* <Stack direction="row" sx={{ gap: 18 }} mt={2}> */}
        <ThemeProvider theme={defaultContrastThresholdTheme}>
          <Stack sx={{ gap: 1, alignItems: 'center' }}>
            <Tooltip title='Add Device'>
              <Stack direction="row" sx={{ gap: 1 }}>
                <Button variant="contained" color="warning" onClick={handleClick}>
                  Add Device
                </Button>
              </Stack>
            </Tooltip>
          </Stack>
        </ThemeProvider>
      {/* </Stack> */}

      <CreateDeviceForm
        open={isCreateFormOpen}
        onClose={handleCloseCreateForm}
        onDeviceAdded={onDeviceAdded} />
    </>
  );
}
