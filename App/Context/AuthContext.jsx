import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'my-jwt';
const API_URL = 'https://localhost:8080';
const AuthContext = createContext({});

// const API_URL = 'https://api.developerbetterapps.com';


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



    const register = async (email, password) => {
        try {
            return await axios.post(`${API_URL}/users`, { email, password });
        } catch (e) {
            return { error: true, msg: e.response.data.msg };
        }
    };

    const login = async (email, password) => {
        try {
            const result = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { accessToken, refreshToken } = result.data;

            setAuthState({
                token: accessToken,
                refreshToken: refreshToken,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);

            return result;
        } catch (e) {
            console.error(e);
            return { error: true, msg: e.response.data.msg };
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
            const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken: storedRefreshToken,
            });

            const { accessToken, newRefreshToken } = response.data;

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
