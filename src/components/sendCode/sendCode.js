// import useTelegramService from "../../services/telegramService";

const SendCode = () => {
  const token = localStorage.getItem('token');
  // const {loading, error, codeRequest} = useTelegramService();
  const step = localStorage.getItem('step');

  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/telegram/sendCode", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        // body: JSON.stringify({  }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        localStorage.setItem('phoneNumber', data.phoneNumber);
        localStorage.setItem('phoneCodeHash', data.phoneCodeHash);
        alert('Request successful!');
      } else {
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('phoneCodeHash');
        alert('Request failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div className='sendCode'>
      <button 
      style={{'display' : step === 1 ? 'none' : 'block'}}
      onClick={handleClick}>
        Send Request
      </button>
    </div>
  )
}

export default SendCode;