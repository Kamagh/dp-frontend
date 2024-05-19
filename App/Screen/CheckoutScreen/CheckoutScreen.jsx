import React, { useEffect, useState } from 'react';
import { Alert, Button, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useStripe } from "@stripe/stripe-react-native";
import { useAuth } from '../../Context/AuthContext';

export default function CheckoutScreen({ title, items, vendingMachineId, disabled }) {
    const API_URL = 'https://a0ef-5-77-254-89.ngrok-free.app/api'; // Replace with your actual backend URL
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const { authState } = useAuth(); // Assuming authState contains the accessToken

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vending_machine_id: vendingMachineId,
                    items
                })
            });
            const { payment_intent_secret, ephemeral_key, customer_id } = await response.json();
            return { payment_intent_secret, ephemeral_key, customer_id };
        } catch (error) {
            console.error('Error fetching payment sheet params:', error);
            Alert.alert('Error', 'Unable to fetch payment sheet parameters.');
            setLoading(false);
        }
    };

    const initializePaymentSheet = async () => {
        const params = await fetchPaymentSheetParams();
        if (!params) return;

        const { payment_intent_secret, ephemeral_key, customer_id } = params;
        const { error } = await initPaymentSheet({
            merchantDisplayName: "Disp, Inc.",
            customerId: customer_id,
            customerEphemeralKeySecret: ephemeral_key,
            paymentIntentClientSecret: payment_intent_secret,
            allowsDelayedPaymentMethods: false,
            defaultBillingDetails: { name: 'Jane Doe' },
        });

        if (!error) {
            setLoading(false);
            setInitialized(true);
        } else {
            Alert.alert('Error', error.message);
            setLoading(false);
        }
    };

    const openPaymentSheet = async () => {
        if (!initialized) {
            Alert.alert('Error', 'Payment sheet not initialized');
            return;
        }

        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
    };

    useEffect(() => {
        setLoading(true);
        initializePaymentSheet();
    }, []);

    return (
        <View style={styles.container}>
            <Button
                title={title}
                onPress={openPaymentSheet}
                disabled={disabled || !initialized}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
