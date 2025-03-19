import useHttp from "../hooks/http.hook";

const useUserService = () => {
  const { loading, request, error, clearError } = useHttp();
  const _baseUrl = process.env.REACT_APP_API_URL;

  const getUserRequest = async (token, id) => {
    const res = await request(`${_baseUrl}/api/users/${id}`,
                              'GET',
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

    return res;
  };

  const updateUserRequest = async (id, token, email, password, phoneNumber) => {
    const res = await request(`${_baseUrl}/api/users/${id}`,
                              "PUT",
                              { email, password, phoneNumber },
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const deleteUserRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/users/${id}`,
                              "DELETE",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  return {
		loading,
		error,
		clearError,
		getUserRequest,
    updateUserRequest,
    deleteUserRequest
	};
}

export default useUserService;
