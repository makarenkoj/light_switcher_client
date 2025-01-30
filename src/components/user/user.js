import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import useUserService from '../../services/userService';
import LocalStorageService, {JWT_TOKEN, USER_ID} from '../../services/LocalStorageService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const UserInfo = () => {
  const [user, setUser] = useState({});
  const [devicesCount, setDevicesCount] = useState(0);
  const [telegramSession, setTelegramSession] = useState(false);
  const { getUserRequest, loading, error } = useUserService();
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getItem(JWT_TOKEN);
  const userId = localStorageService.getItem(USER_ID);

  useEffect(() => {
    const handleUser = async () => {
      try {
        const response = await getUserRequest(token, userId);
        setUser(response.user);
        setDevicesCount(response.devicesCount);
        setTelegramSession(response.telegramSession);
      } catch (error) {
        console.error('Error fetching Telegram status:Error fetching user:', error.message);
    }
  };

  handleUser();
  
     // eslint-disable-next-line
  }, []);

  const content = <Box mt={4} p={2} bgcolor="grey.100" borderRadius={2} textAlign="center">
                    <Typography variant="h6">User Information</Typography>
                    <Typography>Email: {user.email}</Typography>
                    <Typography>Phone: {user.phoneNumber}</Typography>
                    <Typography>Total Devices: {devicesCount}</Typography>
                    <Typography>Telegram session save: {telegramSession.toString()}</Typography>
                  </Box>;

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

export default UserInfo;
