import { useEffect, useState, useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import useIndicatorService from '../../services/indicatorService';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';
import { Brightness4, Brightness7, Warning, Home } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

const StatusIndicators = () => {
  const { t } = useTranslation();
  const [alarmIndicator, setAlarmIndicator] = useState(t('indicator.alarmNotSet'));
  const [powerIndicator, setPowerIndicator] = useState(t('indicator.electricityNotSet'));
  const { getIndicatorsData } = useIndicatorService();
  const localStorageService = useMemo(() => new LocalStorageService(), []);
  const token = useMemo(() => localStorageService.getItem(JWT_TOKEN), [localStorageService]);

  const fatchingIndicators = async () => {
    try {
      const response = await getIndicatorsData(token);
      response.indicators.forEach((indicator) => {
        if (indicator.type === 'alarm') {
          indicator.status ? setAlarmIndicator(t('alarm_status.active')) : setAlarmIndicator(t('alarm_status.inactive'));
        } else if (indicator.type === 'power') {
          indicator.status ? setPowerIndicator(t('power_status.active')) : setPowerIndicator(t('power_status.inactive'));
        }
      });
    } catch (error) {
      console.error(t('errors.indicator.fetch', {error: error}));
    }
  }

  useEffect(() => {
    fatchingIndicators();

    socket.on('indicatorNotification', ({ indicator }) => {
      if (indicator.type === 'alarm') {
        indicator.status ? setAlarmIndicator(t('alarm_status.inactive')) : setAlarmIndicator(t('alarm_status.active'));
      } else if (indicator.type === 'power') {
        indicator.status ? setPowerIndicator(t('power_status.inactive')) : setPowerIndicator(t('power_status.active'));
      }
    });

    return () => {
      socket.off('indicatorNotification');
    };
  }, []);
  
  return (
    <Box mt={4} display="flex" justifyContent="space-around">
      <Typography variant="body1" display="flex" alignItems="center">
        <Home sx={{ mr: 1 }} /> {t('electricity')}: {powerIndicator}
      </Typography>
      <Typography variant="body1" display="flex" alignItems="center">
        <Warning sx={{ mr: 1, color: 'red' }} /> {t('alarm')}: {alarmIndicator}
      </Typography>
      <Typography variant="body1" display="flex" alignItems="center">
        {new Date().getHours() >= 6 && new Date().getHours() <= 18 ? (
          <Brightness7 sx={{ mr: 1 }} />
        ) : (
          <Brightness4 sx={{ mr: 1 }} />
        )}
        {new Date().getHours() >= 6 && new Date().getHours() <= 18
          ? t('daytime')
          : t('nighttime')}
      </Typography>
    </Box>
  );
};

export default StatusIndicators;
