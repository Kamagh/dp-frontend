import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { registerUser, loginUser, refreshToken as refreshUserToken, revokeRefreshToken } from '../../api/api';

const TOKEN_KEY = 'my-jwt';
const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        refreshToken: null,
        authenticated: false,
    });

    useEffect(() => {
        const loadTokens = async () => {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const refreshToken = await SecureStore.getItemAsync('refreshToken');

            if (accessToken && refreshToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                setAuthState({
                    token: accessToken,
                    refreshToken: refreshToken,
                    authenticated: true,
                });
            }
        };

        loadTokens();
    }, []);

    useEffect(() => {
        if (authState.authenticated && authState.token && authState.refreshToken) {
            const interval = setInterval(() => {
                refreshToken();
            }, 15 * 60 * 1000 - 60000); // Refresh every 14 minutes

            return () => clearInterval(interval);
        }
    }, [authState.authenticated, authState.token, authState.refreshToken]);

    const register = async (firstName, lastName, email, password) => {
        try {
            const data = await registerUser(firstName, lastName, email, password);
            const { accessToken, refreshToken } = data;

            setAuthState({
                token: accessToken,
                refreshToken: refreshToken,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);

            return data;
        } catch (e) {
            console.error(e);
            return { error: true, msg: e.response.data.message };
        }
    };

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            const { accessToken, refreshToken } = data;

            setAuthState({
                token: accessToken,
                refreshToken: refreshToken,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);

            return data;
        } catch (e) {
            console.error(e);
            return { error: true, msg: e.response.data.message };
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            token: null,
            refreshToken: null,
            authenticated: false
        });
    };

    const refreshToken = async () => {
        try {
            const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
            const data = await refreshUserToken(storedRefreshToken);

            const { accessToken, newRefreshToken } = data;

            setAuthState(prevState => ({
                ...prevState,
                token: accessToken,
                refreshToken: newRefreshToken || storedRefreshToken,  // Use the old refresh token if a new one isn't provided
            }));

            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            await SecureStore.setItemAsync('accessToken', accessToken);
            if (newRefreshToken) {
                await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            logout();  // Optionally logout the user if token refresh fails
        }
    };

    const value = {
        onLogin: login,
        onRegister: register,
        onLogout: logout,
        authState
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
