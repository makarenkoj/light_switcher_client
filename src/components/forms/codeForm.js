import React, { useState } from 'react';

const CodeForm = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleCode = async () => {
    try {
      const phoneNumber = localStorage.getItem('phoneNumber');
      const phoneCodeHash = localStorage.getItem('phoneCodeHash');
      const token = localStorage.getItem('token');

      const response = await fetch("http://localhost:3001/api/telegram/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code, phoneNumber, phoneCodeHash }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('phoneCodeHash');
        localStorage.setItem('authorized', data.authorized);
        alert('Request successful!');
        setMessage(data.message);
      } else {
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('phoneCodeHash');
        alert('Request failed: ' + data.error);
      }
    } catch (error) {
      console.log('Error:', error.message);
      setMessage(error.message);
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div className='codeInput'>
      <h1>Code Input</h1>
      <p id="message">{message}</p>
      <form onSubmit={handleCode}>
        <input
          type="number"
          id="code"
          placeholder="Enter your code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  )
}

export default CodeForm;