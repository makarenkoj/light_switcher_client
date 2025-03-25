import { Button, CircularProgress, Tooltip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import useDeviceService from '../../services/deviceService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

const ChangeStatusButton = ({deviceId, status, oneUpdateStatus}) => {
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { changeStatusRequest, error, loading } = useDeviceService();
  const { t } = useTranslation();

  const handleStatusToggle = async (deviceId, status) => {
    try {
      await changeStatusRequest(deviceId, token, status);
      oneUpdateStatus(status);
    } catch (error) {
      console.error(t('errors.status', {error: error.message}));
    }
  };

  return (
    <Tooltip title={error || t('turn_status', { status: status ? t('on') : t('off') })}>
      <span>
        <Button variant="contained"
                color={status ? 'success' : 'error'}
                size="smal"
                disabled={loading}
                onClick={() => handleStatusToggle(deviceId, !status)}
                startIcon={loading ? <CircularProgress size={16} /> : status ? <CheckCircle /> : <Cancel />}
                >
          { status ? t('on') : t('off') }
        </Button>
      </span>
    </Tooltip>
  )
};

export default ChangeStatusButton
