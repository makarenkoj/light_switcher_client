import useHttp from "../hooks/http.hook";

const useTelegramService = () => {
	const { loading, request, error, clearError } = useHttp();
	const _baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

	const showTelegramData = async (id, token) => {
		const res = await request(`${_baseUrl}/api/telegram/${id}`,
															'GET',
															null,
															{ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

	const createTelegramData = async (token, apiId, apiHash, channel) => {
		console.log('token:', token);

		const res = await request(`${_baseUrl}/api/telegram`,
															'POST',
															{ apiId, apiHash, channel },
															{ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

	const updateTelegramData = async (id, token, apiId, apiHash, channel) => {
		const res = await request(`${_baseUrl}/api/telegram/${id}`,
															'PUT',
															{ apiId, apiHash, channel },
															{ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

	const deleteTelegramData = async (id, token) => {
		const res = await request(`${_baseUrl}/api/telegram/${id}`,
															'DELETE',
															null,
															{ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

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
		showTelegramData,
		createTelegramData,
		updateTelegramData,
		deleteTelegramData,
	};

}

export default useTelegramService;