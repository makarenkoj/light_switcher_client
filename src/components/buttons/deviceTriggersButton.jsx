import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TablePagination
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useDeviceService from '../../services/deviceService';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';
import ChangeTriggerStatusButton from '../buttons/changeTriggerStatusButton';
import DeleteTriggerButton from '../buttons/deleteTriggerButton';
import UpdateTriggerButton from '../buttons/updateTriggerButton';
import AddDeviceTriggerButton from '../buttons/addDeviceTriggerButton';
import DisconnectTriggerButton from "../buttons/disconnectTriggerButton";
import { useTranslation } from 'react-i18next';

const DeviceTriggersButton = ({ deviceId, triggersCount, deviceName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggers, setTriggers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { getDeviceTriggersRequest } = useDeviceService();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setTriggers([]);
      fetchTriggers(0, rowsPerPage, true);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const fetchTriggers = async (page, limit, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getDeviceTriggersRequest(deviceId, token, page + 1, limit);
      setTotalPages(response.totalPages);
      setTriggers(reset ? response.triggers : response.triggers);
    } catch (error) {
      console.error(t('errors.device_triggers', {error: error.message}));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event, newPage) => {
    setCurrentPage(newPage);
    fetchTriggers(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
    fetchTriggers(0, parseInt(event.target.value, 10), true);
  };

  const handleMenuOpen = (event, trigger) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrigger(trigger);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTrigger(null);
  };

  const handleTriggerStatusUpdate = (triggerId, newStatus) => {
    setTriggers((prev) =>
      prev.map((trigger) =>
        trigger._id === triggerId ? { ...trigger, status: newStatus } : trigger
      )
    );
  };

  const handleTriggerDisconnected = (triggerId) => {
    setTriggers((prevTriggers) => prevTriggers.filter((t) => t._id !== triggerId));
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setIsOpen(true)}>
        {t('trigger.triggers')} ({triggersCount})
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="md" fullWidth>
        <IconButton
          aria-label="close"
          onClick={() => setIsOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box p={3}>
          <Typography variant="h6" textAlign="center" mb={2}>
          {t('trigger.triggers_for', {device: deviceName})}
          </Typography>

          {loading && (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}

          {triggers.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>{t('name')}</strong></TableCell>
                    <TableCell><strong>{t('status')}</strong></TableCell>
                    <TableCell><strong>{t('on')}</strong></TableCell>
                    <TableCell><strong>{t('off')}</strong></TableCell>
                    <TableCell><strong>{t('channel')}</strong></TableCell>
                    <TableCell align="right"><strong></strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {triggers.map((trigger) => (
                    <TableRow key={trigger._id}>
                      <TableCell>{trigger.name}</TableCell>
                      <TableCell>
                        <ChangeTriggerStatusButton
                          triggerId={trigger._id}
                          status={trigger.status}
                          oneUpdateStatus={(newStatus) => handleTriggerStatusUpdate(trigger._id, newStatus)}
                        />
                      </TableCell>
                      <TableCell>{trigger.triggerOn}</TableCell>
                      <TableCell>{trigger.triggerOff}</TableCell>
                      <TableCell>
                        {trigger.chanelName.length > 5 ? trigger.chanelName.slice(0, 5) + '...' : trigger.chanelName}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(event) => handleMenuOpen(event, trigger)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography textAlign="center" mt={2} color="gray">
              {t('trigger.any_triggers')}
            </Typography>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Box mt={3} display="flex" justifyContent="center">
            <AddDeviceTriggerButton deviceId={deviceId} onTriggerAdded={() => fetchTriggers(0, rowsPerPage, true)} />
          </Box>
        </Box>
      </Dialog>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedTrigger && [
          <>
            <MenuItem onClick={() => { 
              handleMenuClose();
              setTriggers((prev) => 
                prev.map((t) => (t._id === selectedTrigger._id ? { ...t, status: !t.status } : t))
              );
            }}>            
              <DisconnectTriggerButton trigger={selectedTrigger} deviceId={deviceId} onTriggerDisconnected={handleTriggerDisconnected} />
            </MenuItem>
            <MenuItem >
              <UpdateTriggerButton trigger={selectedTrigger} onTriggerUpdated={() => {fetchTriggers(0, rowsPerPage, true); handleMenuClose();}} />
            </MenuItem>
            <MenuItem >
              <DeleteTriggerButton trigger={selectedTrigger} onTriggerDeleted={() => {fetchTriggers(0, rowsPerPage, true); handleMenuClose();}} />
            </MenuItem>
          </>
        ]}
      </Menu>
    </>
  );
};

export default DeviceTriggersButton;
