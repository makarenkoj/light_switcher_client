import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage(data.message);
      } else {
        localStorage.removeItem('token');
        setMessage(data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <p>{message}</p>
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
    </div>
  );
}

export default LoginForm;