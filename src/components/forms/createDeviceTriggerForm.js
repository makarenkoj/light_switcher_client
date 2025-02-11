import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import useTriggerService from '../../services/triggerService';
import useDeviceService from '../../services/deviceService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';

const CreateDeviceTriggerForm = ({ open, onClose, deviceId, onTriggerAdded }) => {
  const [triggers, setTriggers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const { showTriggersFilterRequest, error, loading} = useTriggerService();
  const { createDeviceTriggersRequest } = useDeviceService();
  const triggerError = useDeviceService().error;
  const loadingTrigger = useDeviceService().loading;
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const itemsPerPage = 9;


  useEffect(() => {
    if (open) {
      loadTriggers();
    }
  }, [open]);

  const loadTriggers = async () => {
    try {
      const response = await showTriggersFilterRequest(deviceId, token, currentPage, itemsPerPage);
      console.log('triggers:', response)
      setTriggers(response.triggers);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching triggers:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTrigger) return;
console.log('Selected trigger:', selectedTrigger)
    try {
      await createDeviceTriggersRequest(deviceId, token, selectedTrigger);
      onTriggerAdded();
      loadTriggers();
    } catch (error) {
      console.error('Error adding trigger:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Додати тригер до девайса</DialogTitle>
      <DialogContent>
        {loading && <Spinner />}
        {error && <ErrorMessage />}
        <FormControl fullWidth>
          <InputLabel>Оберіть тригер</InputLabel>
          <Select
            value={selectedTrigger}
            onChange={(e) => setSelectedTrigger(e.target.value)}
          >
            {triggers.map((trigger) => (
              <MenuItem key={trigger._id} value={trigger._id}>
                {trigger.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDeviceTriggerForm;
