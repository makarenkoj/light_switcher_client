import { useState, useEffect } from 'react';
import { Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button,
        Typography,
        Card,
        CardContent,
        Divider,
        Stack,
        Tooltip,
        Paper,
        } from '@mui/material';
import useDeviceService from '../../services/deviceService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import ChangeStatusButton from '../buttons/changeStatusButton';
import UpdateDeviceButton from '../buttons/updateDeviceButton';
import DeleteDeviceButton from '../buttons/deleteDeviceButton';
import AddDeviceTriggersButton from '../buttons/addDeviceTriggerButton';
import DeviceTriggersButton from '../buttons/deviceTriggersButton';
// import CreateDeviceTriggerForm from '../forms/createDeviceTriggerForm';

const Device = ({ open, onClose, deviceId, onDeviceUpdated, onDeviceDeleted }) => {
  const { showDeviceRequest, loading, error } = useDeviceService();
  const [device, setDevice] = useState(null);
  const [devicesTriggers, setDevicesTriggers] = useState(null);
  // const [isTriggerFormOpen, setIsTriggerFormOpen] = useState(false);
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);

  useEffect(() => {
    if (open && deviceId) {
      fetchDevice();
    };
    // eslint-disable-next-line
  }, [open, deviceId]);

  const fetchDevice = async () => {
    try {
      const response = await showDeviceRequest(deviceId, token);
      console.log('Device response:', response);
      setDevice(response.device);
      setDevicesTriggers(response.devicesTriggers);
      console.log(response)
    } catch (error) {
      console.error('Error fetching device:', error);
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
      {error && <ErrorMessage />}
      {loading && <Spinner />}
      {device ? (
        <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
          <DialogTitle align="center" sx={{ fontSize: 20, fontWeight: 'bold' }}>
            Device Information
          </DialogTitle>
          <Divider sx={{ my: 2 }} />
          <DialogContent>
            <Card variant="outlined" sx={{ padding: 2, backgroundColor: '#f9f9f9' }}>
              <CardContent>
                <Typography variant="h6" align="center" color="primary">
                  {device.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Typography variant="body1">
                    <strong>Device ID:</strong> {device.deviceId}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Access ID:</strong> {device.accessId}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Secret Key:</strong> {device.secretKey}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} mt={3} justifyContent="center">
              <Tooltip title="Manage Triggers">
                <DeviceTriggersButton deviceId={deviceId} triggersCount={devicesTriggers.length} />
              </Tooltip>
              <Tooltip title="Change Status">
                <ChangeStatusButton deviceId={deviceId} status={device.status} oneUpdateStatus={handleDeviceUpdate} />
              </Tooltip>
              <Tooltip title="Add Trigger">
                <AddDeviceTriggersButton deviceId={deviceId} onTriggerAdded={handleDeviceUpdate} />
              </Tooltip>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Close
            </Button>
            <UpdateDeviceButton device={device} onDeviceUpdated={handleDeviceUpdate} />
            <DeleteDeviceButton device={device} onDeviceDeleted={handleDeviceDelete} />
          </DialogActions>
        </Paper>
      ) : (
        <Typography align="center" sx={{ padding: 3 }}>
          Device not found
        </Typography>
      )}
      {/* <CreateDeviceTriggerForm open={isTriggerFormOpen} onClose={() => setIsTriggerFormOpen(false)} deviceId={deviceId} onTriggerAdded={fetchDevice} /> */}
    </Dialog>
  );
};

export default Device;
