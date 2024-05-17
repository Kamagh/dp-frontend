import {Alert, Button} from "react-native";
import {useEffect, useState} from "react";
import {useStripe} from "@stripe/stripe-react-native";

export default function CheckoutScreen() {
    const API_URL = 'https://localhost:8080';
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const [loading, setLoading] = useState(false);

    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`${API_URL}/payment-sheet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const {paymentIntent, ephemeralKey, customer} = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const {error} = await initPaymentSheet({
            merchantDisplayName: "disp, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: false,
            defaultBillingDetails: {
                name: 'Jane Doe',
            }
        });

        if (!error) {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const {error} = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
    };


    useEffect(() => {
        initializePaymentSheet();
    }, []);

    return (
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