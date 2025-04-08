import { Button } from '@mui/material';
import LocalStorageService from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    const localStorageService = new LocalStorageService();
    localStorageService.clear();
    onLogout();
  };
  const { t } = useTranslation();


  return (
    <Button
      color="inherit"
      onClick={handleLogout}
    >
      {t('logout')}
    </Button>
  );
};

export default LogoutButton;
