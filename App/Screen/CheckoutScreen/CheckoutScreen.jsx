import {useStripe} from "@stripe/stripe-react-native";
import {useEffect, useState} from "react";
import {ActivityIndicator, Alert, Button, View, StyleSheet} from "react-native";

export default function CheckoutScreen({title, items, vendingMachineId, disabled}) {
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const [loading, setLoading] = useState(false);

    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`https://a0ef-5-77-254-89.ngrok-free.app/api/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                vending_machine_id: 2,
                items: [{
                    item_id: 2,
                    item_name: `Dav's product`,
                    quantity: 3
                }],
            }
        });

        console.log(response);

        const {payment_intent_secret, ephemeral_key, customer_id} = await response.json();

        return {
            payment_intent_secret, ephemeral_key, customer_id
        };
    };

    const initializePaymentSheet = async () => {
        const {
            payment_intent_secret, ephemeral_key, customer_id,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const {error} = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer_id,
            customerEphemeralKeySecret: ephemeral_key,
            paymentIntentClientSecret: payment_intent_secret,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
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
        <View style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#0000ff"/>}
            {!loading && (
                <Button
                    title={title}
                    onPress={openPaymentSheet}
                    disabled={!loading || disabled}
                />
            )}
        </View>
        // <Screen>
        //     <Button
        //         variant="primary"
        //         disabled={!loading}
        //         title="Checkout"
        //         onPress={openPaymentSheet}
        //     />
        // </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
