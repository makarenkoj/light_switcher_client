import { useState } from 'react';
import CreateTriggerForm from '../forms/createTriggerForm';
import { useTranslation } from 'react-i18next';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Button, Tooltip} from '@mui/material';
import { Stack } from '@mui/system';

const defaultContrastThresholdTheme = createTheme({});

export default function AddTriggerButton({ onTriggerAdded }) {
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
            <Tooltip title={t('trigger.add_trigger_title')}>
              <Stack direction="row" sx={{ gap: 1 }}>
                <Button variant="contained" color="warning" onClick={handleClick}>
                  {t('trigger.add_trigger')}
                </Button>
              </Stack>
            </Tooltip>
          </Stack>
        </ThemeProvider>

      <CreateTriggerForm
        open={isCreateFormOpen}
        onClose={handleCloseCreateForm}
        onTriggerAdded={onTriggerAdded} />
    </>
  );
}
