import useHttp from "../hooks/http.hook";
import i18n from '../i18n';

const useRegistrationService = () => {
  const { loading, request, error, clearError } = useHttp();
  const _baseUrl = import.meta.env.VITE_API_URL;
  const _cors_client = import.meta.env.CLIENT || '*';
  const lang = i18n.language;

  const registrationRequest = async (email, password, phoneNumber ) => {
    const res = await request(`${_baseUrl}/api/auth/register`,
                              'POST',
                              { email, password, phoneNumber },
                              { "Accept-Language": lang, 'Content-Type': 'application/json', "Access-Control-Allow-Credentials": _cors_client }
                              );

    return res;
  };

  const loginRequest = async (email, password) => {
    const res = await request(`${_baseUrl}/api/auth/login`,
                              "POST",
                              { email, password },
                              { "Accept-Language": lang, "Content-Type": "application/json" }
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
