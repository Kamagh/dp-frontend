import axios from 'axios';

const API_URL = 'https://a0ef-5-77-254-89.ngrok-free.app/api'; // Update with your backend URL

export const registerUser = async (firstName, lastName, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/sign-up`, {
            first_name: firstName,
            last_name: lastName,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/sign-in`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

export const revokeRefreshToken = async (refreshToken) => {
    try {
        await axios.post(`${API_URL}/auth/refresh/revoke`, { refreshToken });
    } catch (error) {
        console.error('Error revoking refresh token:', error);
        throw error;
    }
};
