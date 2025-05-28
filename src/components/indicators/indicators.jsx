import { useEffect, useState, useMemo } from 'react';
import { Tabs, Tab, Typography, Box, Button, Stack } from '@mui/material';
import useIndicatorService from '../../services/indicatorService';
import LocalStorageService, { JWT_TOKEN, USER_ID } from '../../services/LocalStorageService';
import Spinner from '../spinner/Spinner';
import CreateIndicatorForm from '../forms/createIndicatorForm';
import UpdateIndicatorForm from '../forms/updateIndicatorForm';
import { useTranslation } from 'react-i18next';

const Indicators = ({handleIndicatorDeleted, handleAlarmStatus}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [alarmIndicator, setAlarmIndicator] = useState(null);
  const [powerIndicator, setPowerIndicator] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [editIndicator, setEditIndicator] = useState(null);

  const { getIndicatorsData, updateIndicatorData, loading, error } = useIndicatorService();
  const localStorageService = useMemo(() => new LocalStorageService(), []);
  const token = useMemo(() => localStorageService.getItem(JWT_TOKEN), [localStorageService]);
  const { t } = useTranslation();

  const fetchIndicatorsData = async () => {
    try {
      const response = await getIndicatorsData(token);
      response.indicators.map((indicator ) => {
        console.log(indicator);
        if (indicator.type === 'alarm') {
          setAlarmIndicator(indicator);
        } else if (indicator.type === 'power') {
          setPowerIndicator(indicator);
        }
      });
    } catch (error) {
      console.error(t('errors.indicator.fetch', {error: error}));
    }
  };

  const changeStatus = async (indicator) => {
    try {
      const status = !indicator.status;
      const triggerId = indicator.trigger._id;
      const response = await updateIndicatorData(indicator._id, token, triggerId, status);
      if (response.indicator.type === 'alarm') {
        setAlarmIndicator(response.indicator);
      } else if (response.indicator.type === 'power') {
        setPowerIndicator(response.indicator);
      }
    } catch (error) {
      console.error(t('errors.indicator.change_status', {error: error}));
    }
  };

  useEffect(() => {
    fetchIndicatorsData();
     // eslint-disable-next-line
  }, []);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const renderTabContent = (indicator, type) => (
    <Box p={3} textAlign="center" borderRadius={2}>
      {indicator ? (
        <Stack spacing={2} alignItems="center">
          <Button
            variant="text"
            color={indicator.status ? 'success' : 'error'}
            onClick={() => changeStatus(indicator)}
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          >
            {t('status')}: {indicator.status ? t('on') : t('off')}
          </Button>
          <Typography>
            {t('form.trigger_name')}: {indicator.trigger.name}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setEditIndicator(indicator);
              setOpenUpdate(true);
            }}
          >
            {t('update')}
          </Button>
        </Stack>
      ) : (
        <Button variant="outlined" onClick={() => {
          setEditIndicator(null);
          setOpenCreate(true);
        }}>
          {t('form.create_indicator_form')} {t(`tab.${type}`)}
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <Box width="100%">
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label={t('tab.alarm')} />
          <Tab label={t('tab.power')} />
        </Tabs>

        {loading && <Spinner />}

        {tabIndex === 0 && renderTabContent(alarmIndicator, 'alarm')}
        {tabIndex === 1 && renderTabContent(powerIndicator, 'power')}
      </Box>

      <CreateIndicatorForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onIndicatorCreated={() => {
          setOpenCreate(false);
          fetchIndicatorsData();
        }}
      />

      <UpdateIndicatorForm
        open={openUpdate}
        onClose={() => {
          setOpenUpdate(false);
          setEditIndicator(null);
        }}
        indicator={editIndicator}
        onIndicatorUpdated={() => {
          setOpenUpdate(false);
          setEditIndicator(null);
          fetchIndicatorsData();
        }}
      />
    </>
  );
};

export default Indicators;
