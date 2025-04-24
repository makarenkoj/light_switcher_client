import {useState} from 'react';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
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
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SitemarkIcon } from '../customIcons/customIcons';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useTriggerService from '../../services/triggerService';
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

const CreateTriggerForm = ({ open, onClose, onTriggerAdded }) => {
  const { createTriggerRequest, error, loading } = useTriggerService();
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [triggerOnError, setTriggerOnError] = useState(false);
  const [triggerOnErrorMessage, setTriggerOnErrorMessage] = useState('');
  const [triggerOffError, setTriggerOffError] = useState(false);
  const [triggerOffErrorMessage, setTriggerOffErrorMessage] = useState('');
  const [chanelNameError, setChanelNameError] = useState(false);
  const [chanelNameErrorMessage, setChanelNameErrorMessage] = useState('');
  const [form, setForm] = useState({ name: '', triggerOn: '', triggerOff: '', chanelName: '', status: false });
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
    setTriggerOnError(false);
    setTriggerOnErrorMessage('');
    setTriggerOffError(false);
    setTriggerOffErrorMessage('');
    setChanelNameError(false);
    setChanelNameErrorMessage('');
    setForm({ name: '', triggerOn: '', triggerOff: '', chanelName: '', status: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorageService.getItem(JWT_TOKEN);
    const id = localStorageService.getItem(USER_ID);

    if (nameError || triggerOnError || triggerOffError || chanelNameError) {
      event.preventDefault();
      return;
    };

    try{
      const response = await createTriggerRequest(id, token, form.name, form.triggerOn, form.triggerOff, form.chanelName, form.status);

      setMessage(response.message);
      onTriggerAdded();
      onClose();
    } catch (error) {
      console.log(t('errors.error', {error: error.message}));
      setMessage(error.message);
    }
  };

  const validateInputs = () => {
    const name = document.getElementById('name');
    const triggerOn = document.getElementById('triggerOn');
    const triggerOff = document.getElementById('triggerOff');
    const chanelName = document.getElementById('chanelName');

    let isValid = true;

    if (!name.value || name.value.length < 2) {
      setNameError(true);
      setNameErrorMessage(t('errors.form.valid_trigger_name'));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!triggerOn.value || triggerOn.value.length > 51) {
      setTriggerOnError(true);
      setTriggerOnErrorMessage(t('errors.form.trigger_on'));
      isValid = false;
    } else {
      setTriggerOnError(false);
      setTriggerOnErrorMessage('');
    }

    if (!triggerOff.value || triggerOff.value.length > 51) {
      setTriggerOffError(true);
      setTriggerOffErrorMessage(t('errors.form.trigger_off'));
      isValid = false;
    } else {
      setTriggerOffError(false);
      setTriggerOffErrorMessage('');
    }

    if (!chanelName.value || chanelName.value.length < 2) {
      setChanelNameError(true);
      setChanelNameErrorMessage(t('errors.form.channel_name'));
      isValid = false;
    } else {
      setChanelNameError(false);
      setChanelNameErrorMessage('');
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
                        {t('trigger.new_trigger')}
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
                          <FormLabel htmlFor="name">{t('form.trigger_name')}</FormLabel>
                          <TextField
                            error={nameError}
                            helperText={nameErrorMessage}
                            id="name"
                            type="name"
                            name="name"
                            placeholder={t('form.trigger_name_placeholder')}
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
                          <FormLabel htmlFor="chanelName">{t('form.channel_name')}</FormLabel>
                          <TextField
                            error={chanelNameError}
                            helperText={chanelNameErrorMessage}
                            name="chanelName"
                            placeholder={t('form.channel_name_placeholder')}
                            type="chanelName"
                            id="chanelName"
                            autoComplete="current-chanelName"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            onChange={handleChange}
                            color={chanelNameError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor="triggerOn">{t('form.trigger_on')}</FormLabel>
                          <TextField
                            error={triggerOnError}
                            helperText={triggerOnErrorMessage}
                            name="triggerOn"
                            placeholder={t('form.trigger_on_placeholder')}
                            type="triggerOn"
                            id="triggerOn"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            onChange={handleChange}
                            color={triggerOnError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor="triggerOff">{t('form.trigger_off')}</FormLabel>
                          <TextField
                            error={triggerOffError}
                            helperText={triggerOffErrorMessage}
                            name="triggerOff"
                            placeholder={t('form.trigger_off_placeholder')}
                            type="triggerOff"
                            id="triggerOff"
                            autoComplete="current-triggerOff"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            onChange={handleChange}
                            color={triggerOffError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor="chanelName">{t('status')}</FormLabel>
                          <Select
                            name="status"
                            placeholder="true"
                            type="status"
                            id="status"
                            value={form.status}
                            onChange={handleChange}
                            >
                            <MenuItem value="false">{t('off')}</MenuItem>
                            <MenuItem value="true">{t('on')}</MenuItem>
                          </Select>
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
                          {t('trigger.create_trigger')}
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

export default CreateTriggerForm
