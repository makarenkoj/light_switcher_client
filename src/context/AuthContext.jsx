import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from 'react';
import LocalStorageService, { JWT_TOKEN, USER_ID } from '../services/LocalStorageService';
import { jwtDecode } from 'jwt-decode'; 
import { useTranslation } from 'react-i18next';
import Spinner from '../components/spinner/Spinner';

const AuthContext = createContext(null);

export const useAuth = () => {
    const { t } = useTranslation();
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(t('errors.context'));
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const localStorageService = useMemo(() => new LocalStorageService(), []);

    useEffect(() => {
        const storedToken = localStorageService.getItem(JWT_TOKEN);
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    setUser({
                        id: decoded.userId || localStorageService.getItem(USER_ID),
                        role: decoded.role
                    });
                    setToken(storedToken);
                } else {
                    console.log(t('errors.token_expired'));
                    localStorageService.clear();
                }
            } catch (error) {
                console.error(t('errors.invalid_token', {error: error}));
                localStorageService.clear();
            }
        } else {
            console.log(t('errors.token_found'));
        }
        setIsLoading(false);
    }, [localStorageService]);

    const login = useCallback((userData) => {
        localStorageService.setItem(JWT_TOKEN, userData.token);
        localStorageService.setItem(USER_ID, userData.id);
        setToken(userData.token);
        setUser({
            id: userData.id,
            role: userData.role
        });
    }, [localStorageService]);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorageService.clear();
    }, [localStorageService]);

    const contextValue = useMemo(() => ({
        user,
        token,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isLoggedIn: !!user
    }), [user, token, isLoading, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading ? children : <Spinner />}
        </AuthContext.Provider>
    );
};
