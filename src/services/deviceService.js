import useHttp from "../hooks/http.hook";

const useDeviceService = () => {
  const { loading, request, error, clearError } = useHttp();
	const _baseUrl = 'http://localhost:3001';

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
    deleteDeviceRequest
	};
}

export default useDeviceService;
