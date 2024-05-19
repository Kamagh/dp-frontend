import axios from 'axios';

const API_URL = 'https://a0ef-5-77-254-89.ngrok-free.app/api'; // Update with your backend URL

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchPaymentSheetParams = async () => {
    try {
        const response = await axios.post(`${API_URL}/payment-sheet`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching payment sheet params:', error);
        throw error;
    }
};
