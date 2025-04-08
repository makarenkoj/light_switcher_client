import {useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Box,
  CssBaseline,
  FormLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { SitemarkIcon } from '../customIcons/customIcons';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useTriggerService from '../../services/triggerService';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import { useTranslation } from 'react-i18next';

const UpdateTriggerForm = ({ trigger, open, onClose, onTriggerUpdated }) => {
  const { updateTriggerRequest, error, loading } = useTriggerService();
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [triggerOnError, setTriggerOnError] = useState(false);
  const [triggerOnErrorMessage, setTriggerOnErrorMessage] = useState('');
  const [triggerOffError, setTriggerOffError] = useState(false);
  const [triggerOffErrorMessage, setTriggerOffErrorMessage] = useState('');
  const [chanelNameError, setChanelNameError] = useState(false); 
  const [chanelNameErrorMessage, setChanelNameErrorMessage] = useState(false); 
  const { t } = useTranslation();
  const [form, setForm] = useState({ status: trigger.status, name: '', triggerOn: '', triggerOff: '', chanelName: '' });

  const localStorageService = new LocalStorageService();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorageService.getItem(JWT_TOKEN);

    if (nameError || triggerOnError || triggerOffError || chanelNameError) {
      event.preventDefault();
      return;
    };

    try{
      const response = await updateTriggerRequest(trigger._id, token, form.status, form.name, form.triggerOn, form.triggerOff, form.chanelName)
      setMessage(response.message);
      onTriggerUpdated();
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

    if (name.value.length && name.value.length < 2) {
      setNameError(true);
      setNameErrorMessage(t('errors.form.valid_name'));
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (triggerOn.value.length && triggerOn.value.length > 150) {
      setTriggerOnError(true);
      setTriggerOnErrorMessage(t('errors.form.trigger_on'));
      isValid = false;
    } else {
      setTriggerOnError(false);
      setTriggerOnErrorMessage('');
    }

    if (triggerOff.value.length && triggerOff.value.length > 150) {
      setTriggerOffError(true);
      setTriggerOffErrorMessage(t('errors.form.trigger_off'));
      isValid = false;
    } else {
      setTriggerOffError(false);
      setTriggerOffErrorMessage('');
    }

    if (chanelName.value.length && chanelName.value.length < 2) {
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
                    <DialogTitle>
                      {t('trigger.update_trigger')}
                    </DialogTitle>
                    <SitemarkIcon />
                    <DialogContent>
                      <DialogContentText>
                        {t('trigger.fill_out')}
                      </DialogContentText>
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
                          <FormLabel htmlFor="name">{t('trigger.name')}</FormLabel>
                          <TextField
                            error={setNameError}
                            helperText={nameErrorMessage}
                            id="name"
                            type="name"
                            name="name"
                            placeholder={trigger.name}
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
                          <FormLabel htmlFor="triggerOn">{t('trigger.on')}</FormLabel>
                            <TextField
                              error={triggerOnError}
                              helperText={triggerOnErrorMessage}
                              name="triggerOn"
                              placeholder={trigger.triggerOn}
                              type="triggerOn"
                              id="triggerOn"
                              autoComplete="current-triggerOn"
                              autoFocus
                              required
                              fullWidth
                              variant="outlined"
                              onChange={handleChange}
                              color={triggerOnError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor="triggerOff">{t('trigger.off')}</FormLabel>
                          <TextField
                              error={triggerOffError}
                              helperText={triggerOffErrorMessage}
                              name="triggerOff"
                              placeholder={trigger.triggerOff}
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
                            <FormLabel htmlFor="chanelName">{t('channel')}</FormLabel>
                            <TextField
                              error={chanelNameError}
                              helperText={chanelNameErrorMessage}
                              name="chanelName"
                              placeholder={trigger.chanelName}
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
                            {t('trigger.update_trigger')}
                          </Button>
                        </Box>
                    </DialogContent>
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

export default UpdateTriggerForm
