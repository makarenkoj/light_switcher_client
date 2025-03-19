import useHttp from "../hooks/http.hook";

const useDeviceService = () => {
  const { loading, request, error, clearError } = useHttp();
  const _baseUrl = process.env.REACT_APP_API_URL;

  const changeStatusRequest = async (id, token, status) => {
    const res = await request(`${_baseUrl}/api/devices/status/${id}`,
                              'PUT',
                              {status},
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

    return res;
  };

  const getStatusRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/devices/status/${id}`,
                              "GET",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const showDeviceRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/devices/${id}`,
                              "GET",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const showDevicesRequest = async (token, page = 1, limit = 9) => {
    const res = await request(`${_baseUrl}/api/devices?page=${page}&limit=${limit}`,
                              "GET",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const createDeviceRequest = async (id, token, name, deviceId, accessId, secretKey) => {
    const res = await request(`${_baseUrl}/api/devices/`,
                              "POST",
                              {id, name, deviceId, accessId, secretKey},
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const updateDeviceRequest = async (id, token, name, deviceId, accessId, secretKey) => {
    const res = await request(`${_baseUrl}/api/devices/${id}`,
                              "PUT",
                              {name, deviceId, accessId, secretKey},
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const deleteDeviceRequest = async (id, token) => {
    const res = await request(`${_baseUrl}/api/devices/${id}`,
                              "DELETE",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const getDeviceTriggersRequest = async (id, token, page = 1, limit = 9) => {
    const res = await request(`${_baseUrl}/api/devices/${id}/triggers?page=${page}&limit=${limit}`,
                              "GET",
                              null,
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const createDeviceTriggersRequest = async (id, token, triggerId) => {
    const res = await request(`${_baseUrl}/api/devices/${id}/triggers`,
                              "POST",
                              {triggerId},
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  const disconnectTriggerRequest = async (id, token, triggerId) => {
    const res = await request(`${_baseUrl}/api/devices/${id}/triggers`,
                              "DELETE",
                              {triggerId},
                              { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });  

    return res;
  };

  return {
		loading,
		error,
		clearError,
    changeStatusRequest,
    getStatusRequest,
    showDeviceRequest,
    showDevicesRequest,
    updateDeviceRequest,
    createDeviceRequest,
    deleteDeviceRequest,
    getDeviceTriggersRequest,
    createDeviceTriggersRequest,
    disconnectTriggerRequest
	};
}

export default useDeviceService;
