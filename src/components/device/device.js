import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import useDeviceService from '../../services/deviceService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import ChangeStatusButton from '../buttons/changeStatusButton';
import UpdateDeviceButton from '../buttons/updateDeviceButton';
import DeleteDeviceButton from '../buttons/deleteDeviceButton';

const Device = ({ open, onClose, deviceId, onDeviceUpdated, onDeviceDeleted }) => {
  const { showDeviceRequest, loading, error } = useDeviceService();
  const [device, setDevice] = useState(null);
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
      setDevice(response.device);
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

  const content = device ? (<><DialogContent>
                              <DialogTitle>Device Information</DialogTitle>
                                <DialogContent>
                                      <Typography variant="subtitle1" component="div">
                                        Name: {device.name}
                                      </Typography>
                                      <Typography variant="subtitle1" component="div">
                                        DeviceId: {device.deviceId}
                                      </Typography>
                                      <Typography variant="subtitle1" component="div">
                                        AccessId: {device.accessId}
                                      </Typography>
                                      <Typography variant="subtitle1" component="div">
                                        SecretKey: {device.secretKey}
                                      </Typography>
                                      <Typography variant="subtitle1" component="div">
                                        <ChangeStatusButton deviceId={deviceId} status={device.status} oneUpdateStatus={handleDeviceUpdate}/>
                                      </Typography>
                                </DialogContent>

                              <DialogActions sx={{ gap: 5, alignItems: 'center' }}>
                                <Button onClick={onClose} color="primary">Close</Button>
                                <UpdateDeviceButton device={device} onDeviceUpdated={handleDeviceUpdate}/>
                                <DeleteDeviceButton device={device} onDeviceDeleted={handleDeviceDelete}/>
                              </DialogActions>
                            </DialogContent></>) : (<Typography>Device not found</Typography>)

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <Dialog open={open} onClose={onClose}>
      {errorMessage}
      {spinner}
      {content}
    </Dialog>
  );
};

export default Device;
