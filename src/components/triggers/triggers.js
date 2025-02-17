import {
  Dialog,
  CssBaseline,
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState, useEffect, useRef, useCallback } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';
import useTriggerService from '../../services/triggerService';
import useDeviceService from '../../services/deviceService';
import AddTriggerButton from '../buttons/addTriggerButton';
import DeleteTriggerButton from '../buttons/deleteTriggerButton';
import ChangeTriggerStatusButton from '../buttons/changeTriggerStatusButton';
import UpdateTriggerButton from '../buttons/updateTriggerButton';

const Triggers = ({ open, onClose, deviceId }) => {
  const [triggers, setTriggers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { showTriggersRequest, error, loading } = useTriggerService();
  const { getDeviceTriggersRequest } = useDeviceService();
  const itemsPerPage = 9;

  useEffect(() => {
    if (open) {
      resetTriggers();
    }

    // eslint-disable-next-line
  }, [open]);

  const resetTriggers = () => {
    setTriggers([]);
    setPage(1);
    setHasMore(true);
    fetchTriggers(1, true);
  };

  const fetchTriggers = async (currentPage, reset = false) => {
    try {
      let response;
      if (deviceId) {
        response = await getDeviceTriggersRequest(deviceId, token, currentPage, itemsPerPage);
      } else {
        response = await showTriggersRequest(token, currentPage, itemsPerPage, deviceId);
      }

      if (reset) {
        setTriggers(response.triggers);
      } else {
        setTriggers((prev) => [...new Set([...prev, ...response.triggers])]);
      }

      setHasMore(response.triggers.length === itemsPerPage);
    } catch (error) {
      console.error('Trigger list error:', error.message);
    }
  };

  const handleTriggerUpdate = async (updatedTrigger) => {
    setTriggers((prevTriggers) =>
      prevTriggers.map((trigger) =>
        trigger._id === updatedTrigger._id ? updatedTrigger : trigger
      )
    );
  };

  const lastTriggerRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      fetchTriggers(page);
    }

    // eslint-disable-next-line
  }, [page]);

  const triggersContent = (
    <>
      <Box mt={2} display="flex" justifyContent="center">
        <AddTriggerButton onTriggerAdded={resetTriggers} />
      </Box>
      <Grid container spacing={3} mt={2} justifyContent="center">
        {triggers.map((trigger, index) => (
          <Grid item xs={12} sm={6} md={4} key={trigger._id} ref={index === triggers.length - 1 ? lastTriggerRef : null}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {trigger.name}
                </Typography>
                <Typography color="text.secondary">On: {trigger.triggerOn}</Typography>
                <Typography color="text.secondary">Off: {trigger.triggerOff}</Typography>
                <Typography color="text.secondary">Channel: {trigger.chanelName}</Typography>
                <Box mt={2} display="flex" justifyContent="center">
                  <ChangeTriggerStatusButton
                    triggerId={trigger._id}
                    status={trigger.status}
                    oneUpdateStatus={() => handleTriggerUpdate({ ...trigger, status: !trigger.status })}
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <UpdateTriggerButton trigger={trigger} onTriggerUpdated={resetTriggers} />
                <DeleteTriggerButton trigger={trigger} onTriggerDeleted={resetTriggers} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box mt={2} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      <Box mt={4} display="flex" justifyContent="center">
        <Button onClick={onClose} variant="contained" color="secondary">
          Закрити
        </Button>
      </Box>
    </>
  );

  const notContent = (
    <>
      <Grid container spacing={3} mt={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography textAlign="center">Тригери не знайдено</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box mt={2} display="flex" justifyContent="center">
        <AddTriggerButton onTriggerAdded={resetTriggers} />
      </Box>
      <Box mt={4} display="flex" justifyContent="center">
        <Button onClick={onClose} variant="contained" color="secondary">
          Закрити
        </Button>
      </Box>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <CssBaseline enableColorScheme />
      {error && <ErrorMessage />}
      {loading && <Spinner />}
      {triggers.length > 0 ? triggersContent : notContent}
    </Dialog>
  );
};

export default Triggers;
