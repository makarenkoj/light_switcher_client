import { useState, useEffect } from 'react';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useDeviceService from '../../services/deviceService';
import AddDevice from '../buttons/addDevice';
import ChangeStatusButton from '../buttons/changeStatusButton';
import Device from '../device/device';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Pagination,
  Box,
  Tooltip,
  Button,
  Stack
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import io from "socket.io-client";
import { useTranslation } from 'react-i18next';

const socket = io(import.meta.env.VITE_API_URL);

const DeviceList = ({onDeviceAdded}) => {
  const [devices, setDevices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [IsDeviceOpen, setIsDeviceOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const itemsPerPage = 9;
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { showDevicesRequest, error, loading } = useDeviceService();
  const { t } = useTranslation();

  const fetchDevices = async () => {
    try {
      const response = await showDevicesRequest(token, currentPage, itemsPerPage);
      setDevices(response.devices);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(t('errors.device.device_list', {error: error.message}));
    }
  };

  useEffect(() => {
    socket.on("deviceStatusUpdate", ({ deviceId, status }) => {
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device._id === deviceId ? { ...device, status } : device
        )
      );
    });

    return () => {
      socket.off("deviceStatusUpdate");
    };
  }, []);

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line
  }, [currentPage, onDeviceAdded]);

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
  };

  const handleDeviceDeleted = (deletedDeviceId) => {
    setDevices((prevDevices) => prevDevices.filter((device) => device._id !== deletedDeviceId));
  };

  const handleDeviceStatusUpdate = (deviceId, newStatus) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device._id === deviceId ? { ...device, status: newStatus } : device
      )
    );
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
            {t('device.your_devices')}
        </Typography>
        {errorMessage}
        {spinner}

        <Box width="100%" display="flex" justifyContent="center">
          <AddDevice onDeviceAdded={fetchDevices} />
        </Box>

        {devices.length > 0 ? (
          <>
            <Grid container spacing={4} mt={2}>
              {devices.map((device) => (
                <Grid size={{xs: 8, sm: 6, md: 4}} key={device._id}>
                  <Card sx={{ height: '100%', minHeight: '100px', display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                      <Typography component="div">
                        <Tooltip title={t('device.open_device')} >
                          <Stack sx={{ gap: 1, alignItems: 'center' }}>
                            <Button size="small" variant="contained" color="inherit" 
                                    onClick={() => {
                                      setSelectedDevice(device._id);
                                      setIsDeviceOpen(true)}
                                      }>
                              {device.name}
                            </Button>
                          </Stack>
                        </Tooltip>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Box width="100%" display="flex" justifyContent="center">
                        <ChangeStatusButton deviceId={device._id} status={device.status} oneUpdateStatus={(newStatus) => handleDeviceStatusUpdate(device._id, newStatus)} />
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Box>
          </>
        ): (
          <Typography textAlign="center" sx={{ color: 'gray', mt: 2 }}>
            {t('device.dont_have_devices')}
          </Typography>
        )}

        <Device open={IsDeviceOpen} onClose={() => setIsDeviceOpen(false)} deviceId={selectedDevice} onDeviceUpdated={fetchDevices} onDeviceDeleted={handleDeviceDeleted} />
      </Box>
    </>
  )
};

export default DeviceList;
