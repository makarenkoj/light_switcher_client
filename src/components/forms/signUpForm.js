// import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
import LocalStorageService, {JWT_TOKEN} from '../../services/LocalStorageService';
import useRegistrationService from '../../services/registrationServise';


const SignUpForm = () => {
  const { registrationRequest, loading, error, clearError } = useRegistrationService();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  // remove it
  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   if (token) {
  //     // window.location.href = '/';
  //   } else {
  //     localStorage.removeItem('phoneNumber');
  //     localStorage.removeItem('phoneCodeHash');
  //     localStorage.removeItem('step');
  //     localStorage.removeItem('authorized');
  //   }
  // }, []);

  const handleSubmit = async (e) => {
    const localStorageService = new LocalStorageService();

    const registrationUser = () => {
      registrationRequest(email, password, phoneNumber).then((response) => {
          if (response.ok) {
            localStorageService.setItem(JWT_TOKEN, response.token);
            setMessage(response.message);
          } else {
            localStorageService.removeItem(JWT_TOKEN);
            setMessage(response.error);
            throw new Error(response.error);
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
console.log('error:', error);
console.log('clearError:', clearError );
console.log('loading:', loading );
    // try {
    //   const response = await fetch('http://localhost:3001/api/auth/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password, phoneNumber }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     // localStorage.setItem('userId', data.userId);
    //     localStorage.setItem('token', data.token);
    //     setMessage(data.message);
    //   } else {
    //     localStorage.removeItem('token', data.token);
    //     setMessage(data.error);
    //     throw new Error(data.error);
    //   }
    // } catch (error) {
    //   alert(error.message);
    // }
    registrationUser();
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <p id="message">{message}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="phoneNumber"
          id="phoneNumber"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default SignUpForm;
