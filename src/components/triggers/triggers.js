import {
  Dialog,
  CssBaseline,
  Typography,
  Card,
  CardContent,
  CardActions,
  Pagination,
  Box,
  // Tooltip,
  Button,
  Stack
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';
import useTriggerService from '../../services/triggerService';
import  AddTriggerButton from '../buttons/addTriggerButton';
import DeleteTriggerButton from '../buttons/deleteTriggerButton';
import ChangeTriggerStatusButton from '../buttons/changeTriggerStatusButton';
import UpdateTriggerButton from '../buttons/updateTriggerButton';

const Triggers = ({open, onClose}) => {
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [triggers, setTriggers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // const [IsTriggerOpen, setIsTriggerOpen] = useState(false);
  // const [selectedTrigger, setSelectedTrigger] = useState(null);
  const itemsPerPage = 9;
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { showTriggersRequest, error, loading } = useTriggerService();

  const fetchTriggers = async () => {
    try {
      const response = await showTriggersRequest(token, currentPage, itemsPerPage);
      setTriggers(response.triggers);
      setTotalPages(response.triggers);
    } catch (error) {
      console.error('Trigger list error:', error.message);
      // alert(error.message);
    };
  };

  useEffect(() => {
    fetchTriggers();
    // eslint-disable-next-line
  }, [currentPage]);

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
  };

  const handleTriggerUpdate = async () => {
    await fetchTriggers();
  };

  const triggersContent = (
                            <>
                              <Box mt={2} display="flex" justifyContent="center">
                                <AddTriggerButton onTriggerAdded={fetchTriggers} />
                              </Box>
                              <Grid container spacing={2} mt={2} justifyContent="center">
                                {triggers.map((trigger) => (
                                  <Grid item xs={12} sm={6} md={4} size={4} key={trigger._id}>
                                    <Card >
                                      <CardContent >
                                        <Typography  variant="subtitle1" component="div"> 
                                            <Stack sx={{ gap: 1, alignItems: 'center' }}>
                                                {trigger.name}
                                            </Stack>
                                        </Typography>
                                        <Typography>
                                          {trigger.triggerOn}
                                        </Typography>
                                        <Typography>
                                          {trigger.triggerOff}
                                        </Typography>
                                        <Typography>
                                          {trigger.channelName}
                                        </Typography>
                                        <Typography variant="subtitle1" component="div">
                                          <ChangeTriggerStatusButton triggerId={trigger._id} status={trigger.status} oneUpdateStatus={handleTriggerUpdate}/>
                                        </Typography>
                                      </CardContent>
                                      <CardActions>
                                        <UpdateTriggerButton trigger={trigger} onTriggerUpdated={fetchTriggers}/>
                                      </CardActions>
                                      <CardActions>
                                        <DeleteTriggerButton trigger={trigger} onTriggerDeleted={fetchTriggers}/>
                                      </CardActions>
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                              {/* Pagination */}
                              <Box mt={4} display="flex" justifyContent="center">
                                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                              </Box>
                              <Box mt={1} display="flex" justifyContent="center">
                                <Button onClick={onClose} color="primary">Close</Button>
                              </Box>
                            </>
                            );

  const notContent = (
                      <>
                        <Grid container spacing={2} mt={2} justifyContent="center">
                            <Grid item xs={12} sm={6} md={4} size={4} >
                              <Card>
                                <CardContent>
                                  <Typography component="div">
                                      <Stack sx={{ gap: 1, alignItems: 'center' }}>
                                        Trigers not found
                                      </Stack>
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                        </Grid>
                        <Box mt={2} display="flex" justifyContent="center">
                          <AddTriggerButton onTriggerAdded={fetchTriggers}/>
                        </Box>
                        <Box mt={4} display="flex" justifyContent="center">
                          <Button onClick={onClose} color="primary">Close</Button>
                        </Box>
                      </>
                      );

  const content = triggers.length > 0 ? triggersContent : notContent;

  

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <CssBaseline enableColorScheme />
      {errorMessage}
      {spinner}
      {content}
    </Dialog>  
  );
};

export default Triggers;
