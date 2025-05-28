import useHttp from "../hooks/http.hook";
import i18n from '../i18n';

const useIndicatorService = () => {
	const { loading, request, error, clearError } = useHttp();
	const _baseUrl = import.meta.env.VITE_API_URL;
  const lang = i18n.language;

	const getIndicatorsData = async (token) => {
		const res = await request(`${_baseUrl}/api/indicators`,
															'GET',
															null,
															{ "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

	const getIndicatorData = async (token, type) => {
		const res = await request(`${_baseUrl}/api/indicators`,
															'GET',
															{ type },
															{ "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

	const createIndicatorData = async (token, triggerId, type) => {
		const res = await request(`${_baseUrl}/api/indicators`,
															'POST',
															{ triggerId, type },
															{ "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

	const updateIndicatorData = async (token, triggerId, status) => {
		const res = await request(`${_baseUrl}/api/indicators/${id}`,
															'PUT',
															{ triggerId, status },
															{ "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

	const deleteIndicatorData = async (token) => {
		const res = await request(`${_baseUrl}/api/indicators/${id}`,
															'DELETE',
															null,
															{ "Accept-Language": lang, "Content-Type": "application/json", 'Authorization': `Bearer ${token}` });

		return res;
	};

  return {
		loading,
		error,
		clearError,
		getIndicatorsData,
		getIndicatorData,
		createIndicatorData,
		updateIndicatorData,
		deleteIndicatorData,
	};

}

export default useIndicatorService;