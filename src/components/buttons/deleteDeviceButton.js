import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Stack, Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import useDeviceService from '../../services/deviceService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';

const defaultTheme = createTheme();

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
      <Stack direction="row" sx={{ gap: 4 }} mt={2}>
        <ThemeProvider theme={defaultTheme}>
          <Stack sx={{ gap: 1, alignItems: 'center' }}>
            <Button variant="contained" color="error" onClick={handleOpenConfirm}>
              Delete Device
            </Button>
          </Stack>
        </ThemeProvider>
      </Stack>

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
