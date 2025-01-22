import useHttp from "../hooks/http.hook";

const useRegistrationService = () => {
  const { loading, request, error, clearError } = useHttp();
	const _baseUrl = 'http://localhost:3001/;'

  const registrationRequest = async (email, password, phoneNumber ) => {
    const res = await request(`${_baseUrl}api/auth/register`,
                              'POST',
                              { 'Content-Type': 'application/json' },
                              { email, password, phoneNumber }
                              );

    return res.data.results;
  };

  const loginRequest = async (email, password) => {
    const res = await request(`${_baseUrl}api/auth/login`,
                              "POST",
                              { "Content-Type": "application/json" },
                                { email, password }
                              );  

    return res.data.results;
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

