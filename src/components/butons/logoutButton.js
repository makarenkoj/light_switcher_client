import { Button } from '@mui/material';
import LocalStorageService from '../../services/LocalStorageService';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    const localStorageService = new LocalStorageService();
    localStorageService.clear();
    onLogout();
  };

  return (
    <Button
      // variant="outlined"
      color="inherit"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
