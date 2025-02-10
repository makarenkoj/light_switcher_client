import { Button, CircularProgress, Tooltip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import useDeviceService from '../../services/deviceService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';

const ChangeStatusButton = ({deviceId, status, oneUpdateStatus}) => {
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { changeStatusRequest, error, loading } = useDeviceService();

  const handleStatusToggle = async (deviceId, status) => {
    try {
      await changeStatusRequest(deviceId, token, status);
      oneUpdateStatus();
    } catch (error) {
      console.error('Status change error:', error.message);
      // alert(error.message);
    }
  };

  return (
    <Tooltip title={error || `Turn status ${status ? 'Off' : 'on'}`}>
      <span>
        <Button variant="contained"
                color={status ? 'success' : 'error'}
                size="smal"
                disabled={loading}
                onClick={() => handleStatusToggle(deviceId, !status)}
                startIcon={loading ? <CircularProgress size={16} /> : status ? <CheckCircle /> : <Cancel />}
                >
          Status {status ? 'On' : 'Off'}
        </Button>
      </span>
    </Tooltip>
  )
};

export default ChangeStatusButton
