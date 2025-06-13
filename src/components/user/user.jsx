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
import UpdateUserButton from '../buttons/updateUserButton';
import { useTranslation } from 'react-i18next';

const UserInfo = ({handleUserDeleted}) => {
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
  const userRole = useMemo(() => localStorageService.getUserRole(), [localStorageService]);
  const { t } = useTranslation();

  const handleTelegramData = async () => {
    try {
      const response = await getTelegramData(token);
      setUserHasTelegram(true);
      setTelegramData(response.telegram);
    } catch (error) {
      setUserHasTelegram(false);
      console.error(t('errors.telegram.telegram_credentials', {error: error.message}));
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
        console.error(t('errors.user.user_fetching', {error: error.message}));
      }
    };

    handleUser();
    if (userRole === 'admin') {
      handleTelegramData();
    }
     // eslint-disable-next-line
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleSubmit = (data) => {
    handleTelegramData();
  };

  const tabUser = <Box sx={{ width: '100%' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} centered>
                      <Tab label={t('tab.user_general_info')} />
                    </Tabs>

                    {tabIndex === 0 && (
                      <Box p={3} textAlign="center" borderRadius={2} >
                        <Typography>{t('email')}: {user.email}</Typography>
                        <Typography>{t('phone')}: {user.phoneNumber}</Typography>
                        <Typography>{t('device.total_devices', {count: devicesCount})}</Typography>
                        <UpdateUserButton  handleUserDeleted={handleUserDeleted} userData={user}/>
                      </Box>
                    )}

                    {loading && <Spinner />}
                    {error && <ErrorMessage message={error}/>}
                  </Box>

  const tabAdmin = <Box sx={{ width: '100%' }}>
                      <Tabs value={tabIndex} onChange={handleTabChange} centered>
                        <Tab label={t('tab.user_general_info')} />
                        <Tab label={t('tab.telegram_credentials')} />
                      </Tabs>

                      {tabIndex === 0 && (
                        <Box p={3} textAlign="center" borderRadius={2} >
                          <Typography>{t('email')}: {user.email}</Typography>
                          <Typography>{t('phone')}: {user.phoneNumber}</Typography>
                          <Typography>{t('device.total_devices', {count: devicesCount})}</Typography>
                          <UpdateUserButton  handleUserDeleted={handleUserDeleted} userData={user}/>
                        </Box>
                      )}
                      {tabIndex === 1 && (
                        <Box p={3} textAlign="center">
                          {userHasTelegram ? (
                          <>
                            <Typography>{t('telegram.telegram_session_saved', {session: telegramSession ? t('true') : t('false')})}</Typography>
                              <Typography>
                                {t('api_id')}: {showApiId ? telegramData.apiId : '*******'}
                                <IconButton onClick={() => setShowApiId(!showApiId)}>
                                  {showApiId ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </Typography>
                              <Typography>
                                {t('api_hash')}: {showApiHash ? telegramData.apiHash : '**************'}
                                <IconButton onClick={() => setShowApiHash(!showApiHash)}>
                                  {showApiHash ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </Typography>
                              <Typography>{t('channel')}: {telegramData.channel}</Typography>
                              <UpdateTelegramButton telegramData={telegramData} onUpdate={handleSubmit} />
                          </>
                          ) : (
                          <OpenTelegramFormButton onSubmit={handleSubmit}/>)}
                        </Box>
                      )}

                      {loading && <Spinner />}
                      {error && <ErrorMessage message={error}/>}
                    </Box>

  return (
    <>
      {userRole === 'admin' ? tabAdmin : tabUser}
    </>
  );
};

export default UserInfo;
