import { useState, useEffect } from 'react';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useDeviceService from '../../services/deviceService';
import AddDevice from '../buttons/addDevice';
import UpdateDeviceButton from '../buttons/updateDeviceButton';
import DeleteDeviceButton from '../buttons/deleteDeviceButton';
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

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [IsDeviceOpen, setIsDeviceOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const itemsPerPage = 9;
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { showDevicesRequest, error, loading } = useDeviceService();

  const fetchDevices = async () => {
    try {
      const response = await showDevicesRequest(token, currentPage, itemsPerPage);
      setDevices(response.devices);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Device list error:', error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeviceDeleted = (deletedDeviceId) => {
    setDevices((prevDevices) => prevDevices.filter((device) => device._id !== deletedDeviceId));
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <>
    {errorMessage}
    {spinner}
    <AddDevice onDeviceAdded={fetchDevices} />
    {devices.length > 0 && (
        <>
          <Grid container spacing={4} mt={2}>
            {devices.map((device) => (
              <Grid item xs={12} sm={6} md={4} size={4} key={device._id}>
                <Card>
                  <CardContent>
                    <Typography >
                      <Tooltip title='Open Device' >
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
                    <ChangeStatusButton deviceId={device._id} status={device.status} oneUpdateStatus={fetchDevices} />
                  </CardActions>
                  <CardActions>
                    <UpdateDeviceButton device={device} onDeviceUpdated={fetchDevices}/>
                  </CardActions>
                  <CardActions>
                    <DeleteDeviceButton device={device} onDeviceDeleted={fetchDevices}/>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* Pagination */}
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
          </Box>
        </>
      )}

      <Device open={IsDeviceOpen} onClose={() => setIsDeviceOpen(false)} deviceId={selectedDevice} onDeviceUpdated={fetchDevices} onDeviceDeleted={handleDeviceDeleted} />
    </>
  )
};

export default DeviceList;
