import React, { useState } from 'react';
// import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
// import useRegistrationService from '../../services/registrationServise';
// import Spinner from '../spinner/Spinner';
// import ErrorMessage from '../errorMessage/ErrorMessage';
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Pagination,
  Box,
} from '@mui/material';

const DeviceList = () => {
  const [devices, setDevices] = useState([
      { id: 1, name: 'Lamp', status: true },
      { id: 2, name: 'Heater', status: false },
      { id: 3, name: 'Fan', status: true },
      // Add more devices as needed
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

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
  // const errorMessage = error ? <ErrorMessage /> : null;
  // const spinner = loading ? <Spinner /> : null;

  return (
    <>
    <Grid container spacing={4}>
    {/* {errorMessage} */}
    {/* {spinner} */}
      {currentDevices.map((device) => (
        <Grid item xs={12} sm={6} md={4} key={device.id}>
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
  )
};

export default DeviceList;
