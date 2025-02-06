import { useState } from 'react';
import { Stack, Button, Dialog, DialogActions, DialogTitle, Tooltip } from '@mui/material';
import useDeviceService from '../../services/deviceService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';

export default function DeleteDeviceButton({ device, onDeviceDeleted }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteDeviceRequest } = useDeviceService();

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
      console.error('Error deleting device:', error.message);
    }
  };

  return (
    <>
      <Tooltip title='Delete Device' >
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Button size="small" variant="contained" color="inherit" onClick={handleOpenConfirm}>
            Delete Device
          </Button>
        </Stack>
      </Tooltip>
      <Dialog open={isConfirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Are you sure you want to delete this device?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
