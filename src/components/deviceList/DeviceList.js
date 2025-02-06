import { useState, useEffect } from 'react';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useDeviceService from '../../services/deviceService';
import AddDevice from '../buttons/addDevice';
import UpdateDeviceButton from '../buttons/updateDeviceButton';
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Pagination,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
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

    const handleDeviceToggle = (id) => {
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === id ? { ...device, status: !device.status } : device
        )
      );
    };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
                    <Typography variant="h6">{device.name}</Typography>
                    <Typography color="text.secondary">
                      Status: {device.status ? 'On' : 'Off'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <UpdateDeviceButton device={device} onDeviceUpdated={fetchDevices}/>
                  </CardActions>
                  <CardActions>
                    <Button size="small" onClick={() => handleDeviceToggle(device._id)}>
                      Toggle
                    </Button>
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
    </>
  )
};

export default DeviceList;
