import { useState, useEffect, useRef } from 'react';
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
  Box,
  CircularProgress
} from '@mui/material';
import useTriggerService from '../../services/triggerService';
import useDeviceService from '../../services/deviceService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';

const CreateDeviceTriggerForm = ({ open, onClose, deviceId, onTriggerAdded }) => {
  const [triggers, setTriggers] = useState([]);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const { showTriggersFilterRequest, error, loading } = useTriggerService();
  const { createDeviceTriggersRequest } = useDeviceService();
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const itemsPerPage = 5;

  useEffect(() => {
    if (open) {
      resetForm();
      loadTriggers(1);
    }

    // eslint-disable-next-line
  }, [open]);

  const resetForm = () => {
    setTriggers([]);
    setSelectedTrigger('');
    setPage(1);
    setHasMore(true);
  };

  const loadTriggers = async (currentPage) => {
    setLoadingMore(true);
    try {
      const response = await showTriggersFilterRequest(deviceId, token, currentPage, itemsPerPage);
      setTriggers((prev) => [...prev, ...response.triggers]);
      setHasMore(response.triggers.length === itemsPerPage);
    } catch (error) {
      console.error('Error fetching triggers:', error);
    }
    setLoadingMore(false);
  };

  const lastTriggerRef = (node) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    if (page > 1) {
      loadTriggers(page);
    }

    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (!triggers.find((t) => t._id === selectedTrigger)) {
      setSelectedTrigger('');
    }

    // eslint-disable-next-line
  }, [triggers]);

  const handleSubmit = async () => {
    if (!selectedTrigger) return;

    try {
      await createDeviceTriggersRequest(deviceId, token, selectedTrigger);
      onTriggerAdded();
      resetForm();
      loadTriggers(1);
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
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel shrink sx={{ transform: 'translateY(-20px)' }}>Оберіть тригер</InputLabel>
          <Select
            value={selectedTrigger}
            onChange={(e) => setSelectedTrigger(e.target.value)}
            displayEmpty
          >
            {triggers.length === 0 ? (
              <MenuItem disabled>Тригери відсутні</MenuItem>
            ) : (
              triggers.map((trigger, index) => (
                <MenuItem
                  key={trigger._id}
                  value={trigger._id}
                  ref={index === triggers.length - 1 ? lastTriggerRef : null}
                >
                  {trigger.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        {loadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Скасувати</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!selectedTrigger}>
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDeviceTriggerForm;
