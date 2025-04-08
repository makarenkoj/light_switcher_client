import { useState } from 'react';
import UpdateTriggerForm from '../forms/updateTriggerForm';
import {Button, Tooltip} from '@mui/material';
import { Stack } from '@mui/system';
import { useTranslation } from 'react-i18next';

export default function UpdateTriggerButton({ trigger, onTriggerUpdated }) {
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const { t } = useTranslation();

  const handleClick = async () => {
    setIsUpdateFormOpen(true);
  }

  const handleCloseUpdateForm = () => {
    setIsUpdateFormOpen(false);
  };

  return (
    <>
      <Tooltip title={t('trigger.update_trigger_title')}>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button size="small" variant="contained" color="secondary" onClick={handleClick}>
              {t('trigger.update_trigger')}
            </Button>
          </Stack>
        </Stack>
      </Tooltip>

      <UpdateTriggerForm
        open={isUpdateFormOpen}
        onClose={handleCloseUpdateForm}
        onTriggerUpdated={onTriggerUpdated}
        trigger={trigger} />
    </>
  );
}