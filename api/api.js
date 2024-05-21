import axios from 'axios';
import {useAuth} from "../App/Context/AuthContext";
import {Dimensions} from "react-native";


const API_URL = 'https://a0ef-5-77-254-89.ngrok-free.app/api'; // Update with your backend URL

// Helper function to get the headers with the access token
const getAuthHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const getProductsByVendingMachine = async (vendingMachineId, authToken) => {
    try {
        const response = await axios.get(`${API_URL}/vm/${vendingMachineId}/items`, {
            headers: getAuthHeaders(authToken.token),
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching products by vending machine:', error.message);
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
        const response = await axios.post(`${API_URL}/auth/sign-in`, {email, password});
        return response.data;
    } catch (error) {
        console.error('Error during login:', error.message);
        throw error;
    }
};

export const refreshToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {refresh_token: refreshToken});
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        throw error;
    }
};

export const revokeRefreshToken = async (refreshToken) => {
    try {
        await axios.post(`${API_URL}/auth/refresh/revoke`, {refresh_token: refreshToken});
    } catch (error) {
        console.error('Error revoking refresh token:', error.message);
        throw error;
    }
};

export const lockVendingMachine = async (vendingMachineId, authState) => {
    // console.log(authState.token);
    try {
        await axios.post(`${API_URL}/vm/${vendingMachineId}/lock`, {
            headers: getAuthHeaders(authState.token),
        });
    } catch (error) {
        console.error('Error locking vending machine:', error);
        throw error;
    }
};

export const fetchPaymentSheetParams = async (vendingMachineId, items) => {
    try {
        // Lock the vending machine first
        await lockVendingMachine(vendingMachineId);

        const response = await axios.post(`${API_URL}/order`, {
            vending_machine_id: vendingMachineId,
            items: items,
        }, {
            headers: getAuthHeaders(authState.token),
        });

        const {payment_intent_secret, ephemeral_key, customer_id} = response.data;
        return {payment_intent_secret, ephemeral_key, customer_id};
    } catch (error) {
        console.error('Error fetching payment sheet params:', response, error.message);
        throw error;
    }
};

export const getDispensers = async (bounds, authState) => {
    try {
        console.log('bounds', bounds);
        console.log('bounds', authState.token);
        const response = await axios.get(`${API_URL}/vm`, {
            headers: getAuthHeaders(authState.token),
            params: {
                swLong: bounds.southWest.longitude,
                swLat: bounds.southWest.latitude,
                neLong: bounds.northEast.longitude,
                neLat: bounds.northEast.latitude,
            }
        });
        console.log('dispenser', response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching dispensers:', error);
        throw error;
    }
};