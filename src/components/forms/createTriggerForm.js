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
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SitemarkIcon } from '../customIcons/customIcons';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useTriggerService from '../../services/triggerService';
import LocalStorageService, {JWT_TOKEN, USER_ID} from '../../services/LocalStorageService';

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

  const localStorageService = new LocalStorageService();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    if (!name.value || name.value.length < 2) {
      setNameError(true);
      setNameErrorMessage('Please enter a valid name.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!triggerOn.value || triggerOn.value.length > 51) {
      setTriggerOnError(true);
      setTriggerOnErrorMessage('TriggerOn must be at least 6 characters long.');
      isValid = false;
    } else {
      setTriggerOnError(false);
      setTriggerOnErrorMessage('');
    }

    if (!triggerOff.value || triggerOff.value.length > 51) {
      setTriggerOffError(true);
      setTriggerOffErrorMessage('TriggerOff must be at least 6 characters long.');
      isValid = false;
    } else {
      setTriggerOffError(false);
      setTriggerOffErrorMessage('');
    }

    if (!chanelName.value || chanelName.value.length < 2) {
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
                    <SignInContainer direction="column" justifyContent="space-between">
                      <Card variant="outlined">
                        <SitemarkIcon />
                        <Typography
                          component="h1"
                          variant="h4"
                          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                          New Trigger
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
                            <FormLabel htmlFor="name">Triger Name</FormLabel>
                            <TextField
                              error={nameError}
                              helperText={nameErrorMessage}
                              id="name"
                              type="name"
                              name="name"
                              placeholder="Start Light"
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
                            <FormLabel htmlFor="chanelName">Chanel Name</FormLabel>
                            <TextField
                              error={chanelNameError}
                              helperText={chanelNameErrorMessage}
                              name="chanelName"
                              placeholder="My Chanel"
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
                            <FormLabel htmlFor="triggerOn">On</FormLabel>
                            <TextField
                              error={triggerOnError}
                              helperText={triggerOnErrorMessage}
                              name="triggerOn"
                              placeholder="start"
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
                            <FormLabel htmlFor="triggerOff">Off</FormLabel>
                            <TextField
                              error={triggerOffError}
                              helperText={triggerOffErrorMessage}
                              name="triggerOff"
                              placeholder="stop"
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
                            Add Device
                          </Button>
                        </Box>
                      </Card>
                    </SignInContainer>
                  </>


  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <IconButton
          aria-label="close"
          onClick={() => onClose(onClose)}
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
