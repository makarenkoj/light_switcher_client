import useHttp from "../hooks/http.hook";
import i18n from '../i18n';

const useUserService = () => {
  const { loading, request, error, clearError } = useHttp();
  const _baseUrl = import.meta.env.VITE_API_URL;
  const lang = i18n.language;

  const getUserRequest = async (token, id) => {
    const res = await request(`${_baseUrl}/api/users/${id}`,
                              'GET',
                              null,
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

    return res;
  };

  const updateUserRequest = async (id, token, email, password, phoneNumber) => {
    const res = await request(`${_baseUrl}/api/users/${id}`,
                              "PUT",
                              { email, password, phoneNumber },
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const deleteUserRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/users/${id}`,
                              "DELETE",
                              null,
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

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
