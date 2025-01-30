import useHttp from "../hooks/http.hook";

const useUserService = () => {
  const { loading, request, error, clearError } = useHttp();
	const _baseUrl = 'http://localhost:3001';

  const getUserRequest = async (token, id) => {
    const res = await request(`${_baseUrl}/api/users/${id}`,
                              'GET',
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

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
		getUserRequest,
    loginRequest
	};
}

export default useUserService;
