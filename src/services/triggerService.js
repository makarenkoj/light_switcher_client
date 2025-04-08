import useHttp from "../hooks/http.hook";
import i18n from '../i18n';

const useTriggerService = () => {
  const { loading, request, error, clearError } = useHttp();
	const _baseUrl = import.meta.env.VITE_API_URL;
  const lang = i18n.language;

  const showTriggerRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/triggers/${id}`,
                              "GET",
                              null,
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const showTriggersRequest = async (token, page = 1, limit = 9) => {
    const res = await request(`${_baseUrl}/api/triggers?page=${page}&limit=${limit}`,
                              "GET",
                              null,
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const createTriggerRequest = async (id, token, name, triggerOn, triggerOff, chanelName, status) => {
    const res = await request(`${_baseUrl}/api/triggers/`,
                              "POST",
                              {id, name, triggerOn, triggerOff, chanelName, status},
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const updateTriggerRequest = async (id, token, status, name, triggerOn, triggerOff, chanelName) => {
    const res = await request(`${_baseUrl}/api/triggers/${id}`,
                              "PUT",
                              {status, name, triggerOn, triggerOff, chanelName},
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const deleteTriggerRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/triggers/${id}`,
                              "DELETE",
                              null,
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const showTriggersFilterRequest = async (deviceId, token, page = 1, limit = 9) => {
    const res = await request(`${_baseUrl}/api/triggers/filtered?deviceId=${deviceId}&page=${page}&limit=${limit}`,
                              "GET",
                              null,
                              { "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  return {
		loading,
		error,
		clearError,
    showTriggerRequest,
    showTriggersRequest,
    updateTriggerRequest,
    createTriggerRequest,
    deleteTriggerRequest,
    showTriggersFilterRequest
	};
}

export default useTriggerService ;
