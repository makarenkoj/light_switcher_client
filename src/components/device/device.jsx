import { useState, useEffect } from 'react';
import { Dialog,
        // DialogTitle,
        DialogContent,
        DialogActions,
        // Button,
        Typography,
        Card,
        CardContent,
        Divider,
        Stack,
        Tooltip,
        Paper,
        IconButton
        } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useDeviceService from '../../services/deviceService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import ChangeStatusButton from '../buttons/changeStatusButton';
import UpdateDeviceButton from '../buttons/updateDeviceButton';
import DeleteDeviceButton from '../buttons/deleteDeviceButton';
import AddDeviceTriggersButton from '../buttons/addDeviceTriggerButton';
import DeviceTriggersButton from '../buttons/deviceTriggersButton';
import { useTranslation } from 'react-i18next';
// import CreateDeviceTriggerForm from '../forms/createDeviceTriggerForm';

const Device = ({ open, onClose, deviceId, onDeviceUpdated, onDeviceDeleted }) => {
  const { showDeviceRequest, loading, error } = useDeviceService();
  const [device, setDevice] = useState(null);
  const [devicesTriggers, setDevicesTriggers] = useState(null);
  // const [isTriggerFormOpen, setIsTriggerFormOpen] = useState(false);
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { t } = useTranslation();

  useEffect(() => {
    if (open && deviceId) {
      fetchDevice();
    };
    // eslint-disable-next-line
  }, [open, deviceId]);

  const fetchDevice = async () => {
    try {
      const response = await showDeviceRequest(deviceId, token);
      setDevice(response.device);
      setDevicesTriggers(response.devicesTriggers);
    } catch (error) {
      console.error(t('errors.fetching_devices:', {error: error}));
    }
  };

  const handleDeviceUpdate = async () => {
    await fetchDevice();
    onDeviceUpdated();
  };

  const handleDeviceDelete = async () => {
    onDeviceDeleted(deviceId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      {error && <ErrorMessage />}
      {loading && <Spinner />}
      {device ? (
        <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
          <DialogContent>
            <Card variant="outlined" sx={{ padding: 2, backgroundColor: '#f9f9f9' }}>
              <CardContent>
                <Typography variant="h6" align="center" color="primary">
                  {device.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="body1">
                    <strong>{t('device.device_id')}</strong> {device.deviceId}
                  </Typography>
                  <Typography variant="body1">
                    <strong>{t('device.access_id')}</strong> {device.accessId}
                  </Typography>
                  <Typography variant="body1">
                    <strong>{t('device.secret_key')}</strong> {device.secretKey}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} mt={3} justifyContent="center">
              <Tooltip title={t('trigger.title_manage_triggers')}>
                {devicesTriggers.length <= 0 ? (
                  <AddDeviceTriggersButton deviceId={deviceId} onTriggerAdded={handleDeviceUpdate} />
                ) : (
                  <DeviceTriggersButton deviceId={deviceId} triggersCount={devicesTriggers.length} deviceName={device.name} />
                )}
              </Tooltip>
              <Tooltip title={t('trigger.title_change_status')}>
                <ChangeStatusButton deviceId={deviceId} status={device.status} oneUpdateStatus={handleDeviceUpdate} />
              </Tooltip>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
            <UpdateDeviceButton device={device} onDeviceUpdated={handleDeviceUpdate} />
            <DeleteDeviceButton device={device} onDeviceDeleted={handleDeviceDelete} />
          </DialogActions>
        </Paper>
      ) : (
        <Typography align="center" sx={{ padding: 3 }}>
          {t('device.not found')}
        </Typography>
      )}
      {/* <CreateDeviceTriggerForm open={isTriggerFormOpen} onClose={() => setIsTriggerFormOpen(false)} deviceId={deviceId} onTriggerAdded={fetchDevice} /> */}
    </Dialog>
  );
};

export default Device;
