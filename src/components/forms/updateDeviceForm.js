import {useState} from 'react';
import MuiCard from '@mui/material/Card';
import {
  Dialog,
  DialogContentText,
  TextField,
  Button,
  Box,
  CssBaseline,
  FormLabel,
  FormControl,
  Typography,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SitemarkIcon } from '../customIcons/customIcons';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useDeviceService from '../../services/deviceService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const UpdateDeviceForm = ({ device, open, onClose, onDeviceUpdated }) => {
  const { updateDeviceRequest, error, loading } = useDeviceService();
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [deviceIdError, setDeviceIdError] = useState(false);
  const [deviceIdErrorMessage, setDeviceIdErrorMessage] = useState('');
  const [accessIdError, setAccessIdError] = useState(false);
  const [accessIdErrorMessage, setAccessIdErrorMessage] = useState('');
  const [secretKeyError, setSecretKeyError] = useState(false);
  const [secretKeyErrorMessage, setSecretKeyErrorMessage] = useState('');
  const [form, setForm] = useState({ name: '', deviceId: '', accessId: '', accessSecret: '' });
  const { t } = useTranslation();

  const localStorageService = new LocalStorageService();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorageService.getItem(JWT_TOKEN);

    if (nameError || deviceIdError || accessIdError || secretKeyError) {
      event.preventDefault();
      return;
    };

    const formName = form.name ? form.name : '';
    const formDeviceId = form.deviceId ? form.deviceId : '';
    const formAccessId = form.accessId ? form.accessId : '';
    const formSecretKey = form.secretKey ? form.secretKey : '';

    try{
      const response = await updateDeviceRequest(device._id, token, formName, formDeviceId, formAccessId, formSecretKey);

      setMessage(response.message);
      onDeviceUpdated();
      onClose();
    } catch (error) {
      setMessage(t('errors.error', {error: error.message}));
      console.log(message);
    }
  };

  const validateInputs = () => {
    const name = document.getElementById('name');
    const deviceId = document.getElementById('deviceId');
    const accessId = document.getElementById('accessId');
    const secretKey = document.getElementById('secretKey');

    let isValid = true;

    if (name.value.length && name.value.length < 2) {
      setNameError(true);
      setNameErrorMessage(t('errors.form.valid_name'));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (deviceId.value.length && deviceId.value.length < 6) {
      setDeviceIdError(true);
      setDeviceIdErrorMessage(t('errors.form.device_id'));
      isValid = false;
    } else {
      setDeviceIdError(false);
      setDeviceIdErrorMessage('');
    }

    if (accessId.value.length && accessId.value.length < 6) {
      setAccessIdError(true);
      setAccessIdErrorMessage(t('errors.form.access_id'));
      isValid = false;
    } else {
      setAccessIdError(false);
      setAccessIdErrorMessage('');
    }

    if (secretKey.value.length && secretKey.value.length < 6) {
      setSecretKeyError(true);
      setSecretKeyErrorMessage(t('errors.form.secret_key'));
      isValid = false;
    } else {
      setSecretKeyError(false);
      setSecretKeyErrorMessage('');
    }

    return isValid;
  };

  const content = <>
                    <SignInContainer direction="column" justifyContent="space-between">
                      <Card variant="outlined">
                        <SitemarkIcon />
                        <Typography
                          component="h1"
                          variant="h4"
                          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                          {t('device.update_device')}
                        </Typography>
                        <Box
                          component="form"
                          onSubmit={handleSubmit}
                          noValidate
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                          }}
                        >
                          <FormControl>
                            <FormLabel htmlFor="name">{t('form.name')}</FormLabel>
                            <TextField
                              error={setNameError}
                              helperText={nameErrorMessage}
                              id="name"
                              type="name"
                              name="name"
                              placeholder={device.name}
                              autoComplete="name"
                              autoFocus
                              required
                              fullWidth
                              variant="outlined"
                              onChange={handleChange}
                              color={setNameError ? 'error' : 'primary'}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="deviceId">{t('form.device_id')}</FormLabel>
                            <TextField
                              error={deviceIdError}
                              helperText={deviceIdErrorMessage}
                              name="deviceId"
                              placeholder={device.deviceId}
                              type="deviceId"
                              id="deviceId"
                              autoFocus
                              required
                              fullWidth
                              variant="outlined"
                              onChange={handleChange}
                              color={deviceIdError ? 'error' : 'primary'}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="accessId">{t('form.access_id')}</FormLabel>
                            <TextField
                              error={accessIdError}
                              helperText={accessIdErrorMessage}
                              name="accessId"
                              placeholder={device.accessId}
                              type="accessId"
                              id="accessId"
                              autoComplete="current-accessId"
                              autoFocus
                              required
                              fullWidth
                              variant="outlined"
                              onChange={handleChange}
                              color={accessIdError ? 'error' : 'primary'}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="secretKey">{t('form.secret_key')}</FormLabel>
                            <TextField
                              error={secretKeyError}
                              helperText={secretKeyErrorMessage}
                              name="secretKey"
                              placeholder={device.secretKey}
                              type="secretKey"
                              id="secretKey"
                              autoComplete="current-secretKey"
                              autoFocus
                              required
                              fullWidth
                              variant="outlined"
                              onChange={handleChange}
                              color={secretKeyError ? 'error' : 'primary'}
                            />
                          </FormControl>
                          <DialogContentText style={{ color: 'red', marginTop: '10px' }}>
                            {message}
                          </DialogContentText>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                          >
                            {t('device.update_device')}
                          </Button>
                        </Box>
                      </Card>
                    </SignInContainer>
                  </>

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <CssBaseline enableColorScheme />
      {errorMessage}
      {spinner}
      {content}      
    </Dialog>    
  );
}

export default UpdateDeviceForm
