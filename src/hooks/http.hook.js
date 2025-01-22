import { useState, useCallback } from "react";

const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            console.log('response:', data);

            setLoading(false);
            return data;
        } catch(e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError}
}

export default useHttp;
