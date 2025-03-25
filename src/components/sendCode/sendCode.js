// import useTelegramService from "../../services/telegramService";
import { useTranslation } from 'react-i18next';

const SendCode = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  // const {loading, error, codeRequest} = useTelegramService();
  const step = localStorage.getItem('step');
  const _baseUrl = process.env.REACT_APP_API_URL
  const handleClick = async () => {
    try {
      const response = await fetch(`${_baseUrl}/api/telegram/sendCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        // body: JSON.stringify({  }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('phoneNumber', data.phoneNumber);
        localStorage.setItem('phoneCodeHash', data.phoneCodeHash);
        // alert('Request successful!');
      } else {
        localStorage.removeItem('phoneNumber');
        localStorage.removeItem('phoneCodeHash');
        // alert('Request failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('An error occurred: ' + error.message);
    }
  };

  return (
    <div className='sendCode'>
      <button 
      style={{'display' : step === 1 ? 'none' : 'block'}}
      onClick={handleClick}>
        {t('telegram.send_request')}
      </button>
    </div>
  )
}

export default SendCode;