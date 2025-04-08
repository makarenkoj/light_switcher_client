import { useState } from 'react';
import { Stack, Button, Dialog, DialogActions, DialogTitle, Tooltip } from '@mui/material';
import useTriggerService from '../../services/triggerService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

export default function DeleteTriggerButton({ trigger, onTriggerDeleted }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteTriggerRequest } = useTriggerService();
  const { t } = useTranslation();

  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteTriggerRequest(trigger._id, token);
      onTriggerDeleted();
      setIsConfirmOpen(false);
    } catch (error) {
      console.error(t('errors.delete_trigger', { error: error.message}));
    }
  };

  return (
    <>
      <Tooltip title={t('trigger.delete_trigger_title')} >
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Button size="small" variant="contained" color="inherit" onClick={handleOpenConfirm}>
            {t('trigger.delete_trigger')}
          </Button>
        </Stack>
      </Tooltip>
      <Dialog open={isConfirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>{t('trigger.delete_trigger_text')}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleDelete} color="error">
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
