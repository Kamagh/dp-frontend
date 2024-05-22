import React, { useEffect, useState } from 'react';
import {Alert, Button, View, StyleSheet, ActivityIndicator} from 'react-native';
import { useStripe } from "@stripe/stripe-react-native";
import { useAuth } from '../../Context/AuthContext';
import { lockVendingMachine } from "../../../api/api";

export default function CheckoutScreen({ title, items, vendingMachineId, disabled = true }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    const { authState } = useAuth(); // Assuming authState contains the accessToken

    const fetchPaymentSheetParams = async () => {
        try {
            await lockVendingMachine(vendingMachineId, authState.token);
            console.log('items', items)
            const response = await fetch(`https://a0ef-5-77-254-89.ngrok-free.app/api/order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vending_machine_id: vendingMachineId,
                    items
                })
                /*body: JSON.stringify({
                    vending_machine_id: 6,
                    items: [{
                        item_id: 1,
                        item_name: `Aspirin`,
                        quantity: 1
                    }]
                })*/
            });

            const data = await response.json();
            console.log('stripe data', data);
            const { payment_intent_secret, ephemeral_key, customer_id } = data;

            return { payment_intent_secret, ephemeral_key, customer_id };
        } catch (error) {
            console.error('Error fetching payment sheet params:', error.message);
            Alert.alert('Error', 'Unable to fetch payment sheet parameters.');
            setLoading(false);
            throw error;
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
            appearance: customAppearance
        });

        if (!error) {
            setLoading(false);
        } else {
            Alert.alert('Error', error.message);
            setLoading(false);
        }
    };

    const openPaymentSheet = async () => {
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
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {!loading && (
                <Button
                    title={title}
                    onPress={openPaymentSheet}
                    disabled={disabled}
                />
            )}
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

const customAppearance = {
    shapes: {
        borderRadius: 12,
        borderWidth: 0.5,
    },
    primaryButton: {
        shapes: {
            borderRadius: 20,
        },
    },
    colors: {
        primary: '#fcfdff',
        background: '#ffffff',
        componentBackground: '#f3f8fa',
        componentBorder: '#f3f8fa',
        componentDivider: '#000000',
        primaryText: '#000000',
        secondaryText: '#000000',
        componentText: '#000000',
        placeholderText: '#73757b',
    },
};
