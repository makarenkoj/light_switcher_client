import { useEffect, useState, useMemo } from 'react';
import { Tabs, Tab, Typography, Box, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useUserService from '../../services/userService';
import useTelegramService from '../../services/telegramService';
import LocalStorageService, { JWT_TOKEN, USER_ID } from '../../services/LocalStorageService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import OpenTelegramFormButton from '../buttons/openTelegramFormButton';
import UpdateTelegramButton from '../buttons/updateTelegramButton';

const UserInfo = () => {
  const [user, setUser] = useState({});
  const [devicesCount, setDevicesCount] = useState(0);
  const [telegramSession, setTelegramSession] = useState(false);
  const [telegramData, setTelegramData] = useState(false);
  const [userHasTelegram, setUserHasTelegram] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [showApiId, setShowApiId] = useState(false);
  const [showApiHash, setShowApiHash] = useState(false);
  const { getUserRequest, loading, error } = useUserService();
  const { getTelegramData } = useTelegramService();
  const localStorageService = useMemo(() => new LocalStorageService(), []);
  const token = useMemo(() => localStorageService.getItem(JWT_TOKEN), [localStorageService]);
  const userId = useMemo(() => localStorageService.getItem(USER_ID), [localStorageService]);

  const handleTelegramData = async () => {
    try {
      const response = await getTelegramData(token);
      setUserHasTelegram(true);
      setTelegramData(response.telegram);
    } catch (error) {
      setUserHasTelegram(false);
      console.error('Error fetching Telegram data:', error.message);
    }
  };

  useEffect(() => {
    const handleUser = async () => {
      try {
        const response = await getUserRequest(token, userId);
        setUser(response.user);
        setDevicesCount(response.devicesCount);
        setTelegramSession(response.telegramSession);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };

    handleUser();
    handleTelegramData();
     // eslint-disable-next-line
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleSubmit = (data) => {
    console.log('Telegram data:', data);
    handleTelegramData();
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="General Info" />
        <Tab label="Telegram Credentials" />
      </Tabs>

      {tabIndex === 0 && (
        <Box mt={4} p={3} textAlign="center" bgcolor="grey.100"  borderRadius={2}>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phoneNumber}</Typography>
          <Typography>Total Devices: {devicesCount}</Typography>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box p={3} textAlign="center">
          {userHasTelegram ? (
          <>
            <Typography>Telegram session saved: {telegramSession.toString()}</Typography>
              <Typography>
                API ID: {showApiId ? telegramData.apiId : '*******'}
                <IconButton onClick={() => setShowApiId(!showApiId)}>
                  {showApiId ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Typography>
              <Typography>
                API Hash: {showApiHash ? telegramData.apiHash : '**************'}
                <IconButton onClick={() => setShowApiHash(!showApiHash)}>
                  {showApiHash ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Typography>
              <Typography>Channel: {telegramData.channel}</Typography>
              <UpdateTelegramButton telegramData={telegramData} onUpdate={handleSubmit} />
          </>
          ) : (
          <OpenTelegramFormButton onSubmit={handleSubmit}/>)}
        </Box>
      )}

      {loading && <Spinner />}
      {error && <ErrorMessage />}
    </Box>
  );
};

export default UserInfo;
