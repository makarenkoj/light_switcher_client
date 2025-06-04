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
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Spinner from '../spinner/Spinner';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';
import useUserService from '../../services/userService';
import useIndicatorService from '../../services/indicatorService';


const CreateIndicatorForm = ({ open, onClose, onIndicatorCreated, onMessage, initialType }) => {
  const [type, setType] = useState(initialType || 'alarm');
  // const [type, setType] = useState('alarm');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  const { getUserTriggersRequest, loading } = useUserService();
  const { createIndicatorData } = useIndicatorService();
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const itemsPerPage = 5;
  const { t } = useTranslation();

  const handleOnClose = () => {
    onClose();
  };

  useEffect(() => {
    if (open) {
      resetForm();
      loadTriggers(1);
      setType(initialType || 'alarm');
    }
  }, [open, initialType]);

  const resetForm = () => {
    setType(initialType || 'alarm');
    setTriggers([]);
    setSelectedTrigger('');
    setPage(1);
    setHasMore(true);
  };

  const loadTriggers = async (currentPage, initialTrigger = null) => {
    setLoadingMore(true);
    try {
      const response = await getUserTriggersRequest(token, currentPage, itemsPerPage);

      setTriggers((prev) => {
        const uniqueTriggers = new Map(prev.map(t => [t._id, t]));
        response.triggers.forEach(t => uniqueTriggers.set(t._id, t));
        return Array.from(uniqueTriggers.values());
      });
      setHasMore(response.triggers.length === itemsPerPage);
    } catch (err) {
      onMessage(t('errors.triggers.fetching_triggers', { error: err.message || err.toString() }), 'error'); 
      console.error(t('errors.triggers.fetching_triggers', { error: err.message || err.toString() }));
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
  }, [page]);

  useEffect(() => {
    if (selectedTrigger && !triggers.find((t) => t._id === selectedTrigger)) {
      setSelectedTrigger('');
    }
  }, [triggers, selectedTrigger]);

  const handleSubmit = async () => {
    try {
      await createIndicatorData(token, selectedTrigger, type);
      onIndicatorCreated?.();
      onMessage(t('indicator.success.create'), 'success');
      onClose();
    } catch (err) {
      onMessage(t('errors.indicator.create', { error: err.message || err.toString() }), 'error');
      console.error(t('errors.indicator.create', { error: err }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <IconButton
          aria-label="close"
          onClick={handleOnClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
        <CloseIcon />
      </IconButton>
      <DialogTitle>{t('indicator.create')}</DialogTitle>
      <DialogContent>
        {loading && <Spinner />}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel shrink sx={{ transform: 'translateY(-20px)' }}>{t('form.choose_trigger')}</InputLabel>
          <Select
            value={selectedTrigger}
            onChange={(e) => setSelectedTrigger(e.target.value)}
            displayEmpty
          >
            {triggers.length === 0 && !loadingMore && !loading ? (
              <MenuItem disabled>{t('form.missing_triggers')}</MenuItem>
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
            {loadingMore && (
                <MenuItem disabled>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 1 }}>
                        <CircularProgress size={20} />
                    </Box>
                </MenuItem>
            )}
          </Select>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!selectedTrigger || !type}
        >
          {t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateIndicatorForm;
