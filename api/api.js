import axios from 'axios';
import { useAuth } from "../App/Context/AuthContext";


const API_URL = 'https://a0ef-5-77-254-89.ngrok-free.app/api'; // Update with your backend URL

// Helper function to get the headers with the access token
const getAuthHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const getProducts = async () => {
    const { authState } = useAuth();
    try {
        const response = await axios.get(`${API_URL}/products`, {
            headers: getAuthHeaders(authState.token),
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchPaymentSheetParams = async () => {
    const { authState } = useAuth();
    try {
        const response = await axios.post(`${API_URL}/payment-sheet`, {}, {
            headers: getAuthHeaders(authState.token),
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching payment sheet params:', error);
        throw error;
    }
};

export const registerUser = async (firstName, lastName, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/sign-up`, {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
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
        console.error('Error during login:', error.message);
        throw error;
    }
};

export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        throw error;
    }
};

export const revokeRefreshToken = async (refreshToken) => {
    try {
        await axios.post(`${API_URL}/auth/refresh/revoke`, { refresh_token: refreshToken });
    } catch (error) {
        console.error('Error revoking refresh token:', error.message);
        throw error;
    }
};
