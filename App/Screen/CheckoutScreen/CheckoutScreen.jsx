import {useStripe} from "@stripe/stripe-react-native";
import {useEffect, useState} from "react";
import {ActivityIndicator, Alert, Button, View, StyleSheet} from "react-native";
import {useAuth} from '../../Context/AuthContext';
import {lockVendingMachine} from "../../../api/api";

export default function CheckoutScreen({title, items, vendingMachineId, disabled}) {
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const [loading, setLoading] = useState(false);

    const {authState} = useAuth(); // Assuming authState contains the accessToken

    const fetchPaymentSheetParams = async () => {
        try {
            // await lockVendingMachine(2);

            const response = await fetch(`https://a0ef-5-77-254-89.ngrok-free.app/api/order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vending_machine_id: 2,
                    items: [{
                        item_id: 2,
                        item_name: `Dav's product`,
                        quantity: 1
                    }]
                })
            });

            const data = await response.json();
            Alert.alert(data?.message);
            setLoading(false);

            const {payment_intent_secret, ephemeral_key, customer_id, publishable_key} = data?.payment_data;

            return {
                payment_intent_secret, ephemeral_key, customer_id, publishable_key
            };
        } catch (error) {
            Alert.alert(message)
            console.log('Error', error.message());
            throw error;
        }
    };

    const initializePaymentSheet = async () => {
        const {
            payment_intent_secret, ephemeral_key, customer_id,
            publishableKey,
        } = await fetchPaymentSheetParams(2, [{
            item_id: 2,
            item_name: `Dav's product`,
            quantity: 3
        }]);

        const {error} = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer_id,
            customerEphemeralKeySecret: ephemeral_key,
            paymentIntentClientSecret: payment_intent_secret,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
            appearance: customAppearance,
            defaultBillingDetails: {
                name: 'Jane Doe',
            }
        });

        if (error) {
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
            {/*{loading && <ActivityIndicator size="large" color="#0000ff"/>}*/}
            {/*{!loading && (*/}
                <Button
                    title={title}
                    onPress={openPaymentSheet}
                    disabled={disabled}
                />
            {/*)}*/}
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
