import useHttp from "../hooks/http.hook";

const useTelegramService = () => {
	const { loading, request, error, clearError } = useHttp();
	const _baseUrl = 'http://localhost:3001/;'

  const codeRequest = async (token) => {
    const res = await request(`${_baseUrl}api/telegram/sendCode`, 'POST', { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });
    return res.data.results;
  };

	const sendCodeRequest = async (token, code, phoneCodeHash ) => {
    const res = await request(`${_baseUrl}api/telegram/signIn`,
															'POST',
															{code, phoneCodeHash},
															{ "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
														);

    return res;
  };

  return {
		loading,
		error,
		clearError,
		codeRequest,
		sendCodeRequest,
	};

}

export default useTelegramService;