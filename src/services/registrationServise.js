import useHttp from "../hooks/http.hook";

const useRegistrationService = () => {
  const { loading, request, error, clearError } = useHttp();
	const _baseUrl = 'http://localhost:3001/';

  const registrationRequest = async (email, password, phoneNumber ) => {
    const res = await request(`${_baseUrl}api/auth/register`,
                              'POST',
                              { email, password, phoneNumber },
                              { 'Content-Type': 'application/json' }
                              );

    return res;
  };

  const loginRequest = async (email, password) => {
    const res = await request(`${_baseUrl}api/auth/login`,
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
