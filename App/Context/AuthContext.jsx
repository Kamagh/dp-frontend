import {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {registerUser, loginUser, refreshToken as refreshUserToken, revokeRefreshToken} from '../../api/api';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}) => {
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
            }, 60*1000/*15 * 60 * 1000 - 60000*/); // Refresh every 14 minutes

            return () => clearInterval(interval);
        }
    }, [authState.authenticated, authState.token, authState.refreshToken]);

    const register = async (firstName, lastName, email, password) => {
        try {
            const data = await registerUser(firstName, lastName, email, password);
            const {access_token, refresh_token} = data;

            setAuthState({
                token: access_token,
                refreshToken: refresh_token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            await SecureStore.setItemAsync('accessToken', access_token);
            await SecureStore.setItemAsync('refreshToken', refresh_token);

            return data;
        } catch (e) {
            console.error(e);
            return {error: true, msg: e.response?.data?.message || e.message};
        }
    };

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);

            const {access_token, refresh_token} = data;

            setAuthState({
                token: access_token,
                refreshToken: refresh_token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            await SecureStore.setItemAsync('accessToken', access_token);
            await SecureStore.setItemAsync('refreshToken', refresh_token);
            return data;
        } catch (e) {
            console.error(e);
            return {error: true, msg: e.response?.data?.message || e.message};
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
            const {access_token, refresh_token} = data;

            setAuthState(prevState => ({
                ...prevState,
                token: access_token,
                refreshToken: refresh_token,
            }));

            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            await SecureStore.setItemAsync('accessToken', access_token);
            await SecureStore.setItemAsync('refreshToken', refresh_token);

        } catch (error) {
            console.error('Refresh token error:', error.message);
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
