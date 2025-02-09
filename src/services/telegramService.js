import useHttp from "../hooks/http.hook";

const useTelegramService = () => {
	const { loading, request, error, clearError } = useHttp();
	const _baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

	const getTelegramStatus = async (token) => {
		const res = await request(`${_baseUrl}/api/telegram/checkSession`,
															'GET',
															null,
															{ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });
		return res;
	};

  const codeRequest = async (token) => {
    const res = await request(`${_baseUrl}/api/telegram/sendCode`,
														  'POST',
															null,
															{ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });
    return res;
  };

	const sendCodeRequest = async (token, code, phoneNumber, phoneCodeHash ) => {
    const res = await request(`${_baseUrl}/api/telegram/signIn`,
															'POST',
															{code, phoneNumber, phoneCodeHash},
															{ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
														);

    return res;
  };

  return {
		loading,
		error,
		clearError,
		getTelegramStatus,
		codeRequest,
		sendCodeRequest,
	};

}

export default useTelegramService;