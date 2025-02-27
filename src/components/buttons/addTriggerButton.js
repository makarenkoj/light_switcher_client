import { useState } from 'react';
import CreateTriggerForm from '../forms/createTriggerForm';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Button, Tooltip} from '@mui/material';
import { Stack } from '@mui/system';

const defaultContrastThresholdTheme = createTheme({});

export default function AddTriggerButton({ onTriggerAdded }) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const handleClick = async () => {
    setIsCreateFormOpen(true);
  }

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  return (
    <>
      <Stack direction="row" sx={{ gap: 4 }} mt={2}>
        <ThemeProvider theme={defaultContrastThresholdTheme}>
          <Stack sx={{ gap: 1, alignItems: 'center' }}>
            <Tooltip title='Add Trigger'>
              <Stack direction="row" sx={{ gap: 1 }}>
                <Button variant="contained" color="warning" onClick={handleClick}>
                  Add Trigger
                </Button>
              </Stack>
            </Tooltip>
          </Stack>
        </ThemeProvider>
      </Stack>

      <CreateTriggerForm
        open={isCreateFormOpen}
        onClose={handleCloseCreateForm}
        onTriggerAdded={onTriggerAdded} />
    </>
  );
}