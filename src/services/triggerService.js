import useHttp from "../hooks/http.hook";

const useTriggerService = () => {
  const { loading, request, error, clearError } = useHttp();
	const _baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const showTriggerRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/triggers/${id}`,
                              "GET",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const showTriggersRequest = async (token, page = 1, limit = 9) => {
    const res = await request(`${_baseUrl}/api/triggers?page=${page}&limit=${limit}`,
                              "GET",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const createTriggerRequest = async (id, token, name, triggerOn, triggerOff, chanelName, status) => {
    const res = await request(`${_baseUrl}/api/triggers/`,
                              "POST",
                              {id, name, triggerOn, triggerOff, chanelName, status},
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const updateTriggerRequest = async (id, token, status, name, triggerOn, triggerOff, chanelName) => {
    const res = await request(`${_baseUrl}/api/triggers/${id}`,
                              "PUT",
                              {status, name, triggerOn, triggerOff, chanelName},
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const deleteTriggerRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/triggers/${id}`,
                              "DELETE",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const showTriggersFilterRequest = async (deviceId, token, page = 1, limit = 9) => {
    const res = await request(`${_baseUrl}/api/triggers/filtered?deviceId=${deviceId}&page=${page}&limit=${limit}`,
                              "GET",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  
console.log('Trigger response:', res)
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
