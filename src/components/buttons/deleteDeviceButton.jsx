import { useState } from 'react';
import { Stack, Button, Dialog, DialogActions, DialogTitle, Tooltip } from '@mui/material';
import useDeviceService from '../../services/deviceService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

export default function DeleteDeviceButton({ device, onDeviceDeleted }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteDeviceRequest } = useDeviceService();
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
      await deleteDeviceRequest(device._id, token);
      onDeviceDeleted();
      setIsConfirmOpen(false);
    } catch (error) {
      console.error(t('errors.deleting_device', {error: error.message}));
    }
  };

  return (
    <>
      <Tooltip title={t('device.delete_device_title')} >
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Button size="small" variant="contained" color="inherit" onClick={handleOpenConfirm}>
           {t('device.delete_device')}
          </Button>
        </Stack>
      </Tooltip>
      <Dialog open={isConfirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>{t('device.delete_device_text')}</DialogTitle>
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
