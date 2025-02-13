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
      console.log('Error:', error.message);
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
      setNameErrorMessage('Please enter a valid name.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (triggerOn.value.length && triggerOn.value.length > 33) {
      setTriggerOnError(true);
      setTriggerOnErrorMessage('TriggerOn must be at least 6 characters long.');
      isValid = false;
    } else {
      setTriggerOnError(false);
      setTriggerOnErrorMessage('');
    }

    if (triggerOff.value.length && triggerOff.value.length > 33) {
      setTriggerOffError(true);
      setTriggerOffErrorMessage('TriggerOff must be at least 6 characters long.');
      isValid = false;
    } else {
      setTriggerOffError(false);
      setTriggerOffErrorMessage('');
    }

    if (chanelName.value.length && chanelName.value.length < 2) {
      setChanelNameError(true);
      setChanelNameErrorMessage('ChanelName must be at least 6 characters long.');
      isValid = false;
    } else {
      setChanelNameError(false);
      setChanelNameErrorMessage('');
    }

    return isValid;
  };

  const content = <>
                    <DialogTitle>
                      Update Trigger
                    </DialogTitle>
                    <SitemarkIcon />
                    <DialogContent>
                      <DialogContentText>
                        Please fill out the form below to create a new account.
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
                          <FormLabel htmlFor="name">Trigger Name</FormLabel>
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
                          <FormLabel htmlFor="triggerOn">Trigger On</FormLabel>
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
                          <FormLabel htmlFor="triggerOff">Trigger Off</FormLabel>
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
                            <FormLabel htmlFor="chanelName">Chanel Name</FormLabel>
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
                            <FormLabel htmlFor="chanelName">Status</FormLabel>
                            <Select
                              name="status"
                              placeholder="true"
                              type="status"
                              id="status"
                              value={form.status}
                              onChange={handleChange}
                            >
                              <MenuItem value="false">Off</MenuItem>
                              <MenuItem value="true">On</MenuItem>
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
                            Update Trigger
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
