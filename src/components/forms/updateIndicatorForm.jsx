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

const UpdateIndicatorForm = ({ open, onClose, indicator, onIndicatorUpdated, onMessage }) => {
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  const { getUserTriggersRequest, loading } = useUserService();
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const itemsPerPage = 5;
  const { t } = useTranslation();
  const { updateIndicatorData } = useIndicatorService();

  const handleOnClose = () => {
    onClose();
  };

  useEffect(() => {
    if (open && indicator) {
      resetForm();

      if (indicator.trigger?._id) {
        setSelectedTrigger(indicator.trigger._id);
        setTriggers([indicator.trigger]); 
      } else {
        setSelectedTrigger('');
        setTriggers([]);
      }

      loadTriggers(1);
    }
  }, [open, indicator]);
  

  const resetForm = () => {
    setTriggers([]);
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

  const handleSubmit = async () => {
    try {
      const response = await updateIndicatorData(indicator._id, token, selectedTrigger, indicator.status);
      onMessage(t('indicator.success.update', { message: response.message }), 'success');
      onIndicatorUpdated?.();
      handleOnClose();
    } catch (err) {
      onMessage(t('indicator.errors.update', { error: err.message || err.toString() }), 'error');
      console.error(t('indicator.errors.update', { error: err.message || err.toString() }));
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
      <DialogTitle>{t('indicator.update')}</DialogTitle>
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
          disabled={!selectedTrigger || loadingMore || loading}
        >
          {t('update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateIndicatorForm;
