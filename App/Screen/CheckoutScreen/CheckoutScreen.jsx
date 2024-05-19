import React, { useEffect, useState } from 'react';
import { Alert, Button, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useStripe } from "@stripe/stripe-react-native";

export default function CheckoutScreen() {
    const API_URL = 'https://a0ef-5-77-254-89.ngrok-free.app'; // Replace with your actual backend URL
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch(`${API_URL}/payment-sheet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { paymentIntent, ephemeralKey, customer } = await response.json();
            return { paymentIntent, ephemeralKey, customer };
        } catch (error) {
            console.error('Error fetching payment sheet params:', error);
            Alert.alert('Error', 'Unable to fetch payment sheet parameters.');
            setLoading(false);
        }
    };

    const initializePaymentSheet = async () => {
        const params = await fetchPaymentSheetParams();
        if (!params) return;

        const { paymentIntent, ephemeralKey, customer } = params;
        const { error } = await initPaymentSheet({
            merchantDisplayName: "disp, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
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
        // <View style={styles.container}>
        //     {loading ? (
        //         <ActivityIndicator size="large" color="#0000ff" />
        //     ) : (
        //         <Button
        //             title="Checkout"
        //             onPress={openPaymentSheet}
        //             disabled={!initialized}
        //         />
        //     )}
        // </View>
        <>
            <Button
                variant="primary"
                // disabled={!loading}
                title="Checkout"
                onPress={openPaymentSheet}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
