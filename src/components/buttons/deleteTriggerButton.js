import { useState } from 'react';
import { Stack, Button, Dialog, DialogActions, DialogTitle, Tooltip } from '@mui/material';
import useTriggerService from '../../services/triggerService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';

export default function DeleteTriggerButton({ trigger, onTriggerDeleted }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteTriggerRequest } = useTriggerService();

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
      console.error('Error deleting trigger:', error.message);
    }
  };

  return (
    <>
      <Tooltip title='Delete Trigger' >
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Button size="small" variant="contained" color="inherit" onClick={handleOpenConfirm}>
            Delete Trigger
          </Button>
        </Stack>
      </Tooltip>
      <Dialog open={isConfirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Are you sure you want to delete this trigger?</DialogTitle>
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
