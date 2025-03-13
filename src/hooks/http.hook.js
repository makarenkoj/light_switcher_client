import { useState, useCallback } from "react";
import LocalStorageService from "../services/LocalStorageService";

const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const localStorageService = new LocalStorageService();

    const handleUnathorized = (error) => {
        if (error.message === 'Unauthorized') {
            localStorageService.clear();
            window.location.reload();
        };
    };

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        setLoading(true);

        try {
            const response = await fetch(url, {method,
                                               body: body ? JSON.stringify(body) : null,
                                               headers});

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || 'An unexpected error occurred. Please try again later.';
                
                throw new Error(errorMessage);
            }

            const data = await response.json();

            setLoading(false);
            return data;
        } catch(e) {
            setLoading(false);
            setError(e.message);
            handleUnathorized(e);
            throw e;
        }

        // eslint-disable-next-line
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError}
}

export default useHttp;
