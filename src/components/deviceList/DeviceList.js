import { useState, useEffect } from 'react';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useDeviceService from '../../services/deviceService';
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
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { showDevicesRequest, error, loading } = useDeviceService();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const handleDeviceList = async () => {
      try {
        const response = await showDevicesRequest(token);
        setDevices(response.devices);
      } catch (error) {
        console.error('Device list error:', error.message);
        alert(error.message);
      }
    };

    handleDeviceList();
    // eslint-disable-next-line
  }, []);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDevices = devices.slice(startIndex, startIndex + itemsPerPage);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  const devicesContent =  <>
                          <Grid container spacing={4} mt={2}>
                            {currentDevices.map((device) => (
                              <Grid item xs={12} sm={6} md={4} key={device._id} size={4}>
                                <Card>
                                  <CardContent>
                                    <Typography variant="h6" component="div">
                                      {device.name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                      Status: {device.status ? 'On' : 'Off'}
                                    </Typography>
                                  </CardContent>
                                  <CardActions>
                                    <Button
                                      size="small"
                                      onClick={() => handleDeviceToggle(device.id)}
                                    >
                                      Toggle
                                    </Button>
                                  </CardActions>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                          {/* Pagination */}
                          <Box mt={4} display="flex" justifyContent="center">
                            <Pagination
                              count={Math.ceil(devices.length / itemsPerPage)}
                              page={currentPage}
                              onChange={handlePageChange}
                            />
                          </Box>
                          </>

  const content = devices.length ? devicesContent : null;

  return (
    <>
    {errorMessage}
    {spinner}
    {content}
    </>
  )
};

export default DeviceList;
