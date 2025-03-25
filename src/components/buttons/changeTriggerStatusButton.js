import { Button, CircularProgress, Tooltip } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import useTriggerService from '../../services/triggerService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

const ChangeTriggerStatusButton = ({triggerId, status, oneUpdateStatus}) => {
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const { updateTriggerRequest, error, loading } = useTriggerService();
  const { t } = useTranslation();

  const handleStatusToggle = async (triggerId, status) => {
    try {
      await updateTriggerRequest(triggerId, token, status);
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
                onClick={() => handleStatusToggle(triggerId, !status)}
                startIcon={loading ? <CircularProgress size={16} /> : status ? <CheckCircle /> : <Cancel />}
                >
          { status ? t('on') : t('off') }
        </Button>
      </span>
    </Tooltip>
  )
};

export default ChangeTriggerStatusButton
