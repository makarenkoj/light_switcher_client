import useHttp from "../hooks/http.hook";

const useRegistrationService = () => {
  const { loading, request, error, clearError } = useHttp();
  const _baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const _cors_client = process.env.CLIENT || '*';

  const registrationRequest = async (email, password, phoneNumber ) => {
    const res = await request(`${_baseUrl}/api/auth/register`,
                              'POST',
                              { email, password, phoneNumber },
                              { 'Content-Type': 'application/json', "Access-Control-Allow-Credentials": _cors_client }
                              );

    return res;
  };

  const loginRequest = async (email, password) => {
    const res = await request(`${_baseUrl}/api/auth/login`,
                              "POST",
                              { email, password },
                              { "Content-Type": "application/json" }
                              );  

    return res;
  };

  return {
		loading,
		error,
		clearError,
		registrationRequest,
    loginRequest
	};
}

export default useRegistrationService;
