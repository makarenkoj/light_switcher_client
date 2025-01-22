import React, { useState } from 'react';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import useRegistrationService from '../../services/registrationServise';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const LoginForm = () => {
  const { loginRequest, loading, error } = useRegistrationService();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  // const [response, setResponse] = useState('');
  const localStorageService = new LocalStorageService();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // await loginRequest(email, password).then((response) => (setResponse(response)));
      const response = await loginRequest(email, password);
  
      localStorageService.setItem(JWT_TOKEN, response.token);
      setMessage(response.message);
    } catch (error) {
      localStorageService.clear();
      console.error('Login error:', error.message);
      alert(error.message);
      setMessage('Login failed: ' + error.message);
    }
  };

  const form =  <>
                  <h1>Login</h1>
                  <form onSubmit={handleSubmit}>
                    <input 
                      type="text" 
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                    <input 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                    <button type="submit">SUBMIT</button>
                  </form>
                </>;    

  const token = localStorageService.getItem(JWT_TOKEN);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || errorMessage || token) ? form : null;

  return (
    <div className="login">
      <p>{message}</p>
      {errorMessage}
      {spinner}
      {content}
      {/* {form} */}
    </div>
  );
}

export default LoginForm;