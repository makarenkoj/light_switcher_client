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
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { SitemarkIcon } from '../customIcons/customIcons';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useDeviceService from '../../services/deviceService';
import LocalStorageService, {JWT_TOKEN, USER_ID} from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const CreateDeviceForm = ({ open, onClose, onDeviceAdded }) => {
  const { createDeviceRequest, error, loading } = useDeviceService();
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

  const handleOnClose = () => {
    onClose();
    setMessage('');
    setNameError(false);
    setNameErrorMessage('');
    setDeviceIdError(false);
    setDeviceIdErrorMessage('');
    setAccessIdError(false);
    setAccessIdErrorMessage('');
    setSecretKeyError(false);
    setSecretKeyErrorMessage('');
    setForm({ name: '', deviceId: '', accessId: '', secretKey: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorageService.getItem(JWT_TOKEN);
    const id = localStorageService.getItem(USER_ID);

    if (nameError || deviceIdError || accessIdError || secretKeyError) {
      event.preventDefault();
      return;
    };

    try{
      const response = await createDeviceRequest(id, token, form.name, form.deviceId, form.accessId, form.secretKey);

      setMessage(response.message);
      onDeviceAdded();
      onClose();
    } catch (error) {
      console.log(t('errors.error', {error: error.message}));
      setMessage(error.message);
    }
  };

  const validateInputs = () => {
    const name = document.getElementById('name');
    const deviceId = document.getElementById('deviceId');
    const accessId = document.getElementById('accessId');
    const secretKey = document.getElementById('secretKey');

    let isValid = true;

    if (!name.value || name.value.length < 2) {
      setNameError(true);
      setNameErrorMessage(t('errors.form.valid_name'));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!deviceId.value || deviceId.value.length < 6) {
      setDeviceIdError(true);
      setDeviceIdErrorMessage(t('errors.form.device_id'));
      isValid = false;
    } else {
      setDeviceIdError(false);
      setDeviceIdErrorMessage('');
    }

    if (!accessId.value || accessId.value.length < 6) {
      setAccessIdError(true);
      setAccessIdErrorMessage(t('errors.form.access_id'));
      isValid = false;
    } else {
      setAccessIdError(false);
      setAccessIdErrorMessage('');
    }

    if (!secretKey.value || secretKey.value.length < 6) {
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
                    <Card variant="outlined">
                      <SitemarkIcon />
                      <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                        {t('device.add_device')}
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
                            error={nameError}
                            helperText={nameErrorMessage}
                            id="name"
                            type="name"
                            name="name"
                            placeholder="your@name.com"
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
                            placeholder="0w12z••••••"
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
                            placeholder="mds8nr••••••"
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
                            placeholder="d94kmn••••••"
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
                        <DialogContentText style={{ color: 'red', marginTop: '10px', padding: '0 24px' }}>
                          {message}
                        </DialogContentText>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          onClick={validateInputs}
                          >
                          Add Device
                        </Button>
                      </Box>
                    </Card>
                  </>

  const errorMessage = error ? <ErrorMessage message={error}/> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <Dialog open={open}
            onClose={onClose}
            fullWidth maxWidth="sm"
            slotProps={{
              paper: {
                sx: {
                  m: 0,
                  height: 'auto',
                  maxHeight: '95dvh',
                  borderRadius: 2,
                  width: '100%',
                  maxWidth: 400,
                },
              },
            }}>
      <IconButton
          aria-label="close"
          onClick={handleOnClose}
            sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
        <CloseIcon />
      </IconButton>
      <CssBaseline enableColorScheme />
      {errorMessage}
      {spinner}
      {content}      
    </Dialog>    
  );
}

export default CreateDeviceForm
