import React, {useEffect, useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useCart} from "../../Context/CartContext";
import {MaterialIcons} from '@expo/vector-icons';
import CheckoutScreen from "../CheckoutScreen/CheckoutScreen";

export default function CartScreen({navigation}) {
    const {cartItems, clearCart, removeFromCart} = useCart();
    const [timer, setTimer] = useState(null);
    // const [openCheckout, setOpenCheckout] = useState(null)

    useEffect(() => {
        if (cartItems.length > 0 && timer === null) {
            setTimer(300);
        }

        const countdown = timer !== null ? setInterval(() => {
            setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : 0);
        }, 1000) : null;

        return () => countdown && clearInterval(countdown);
    }, [cartItems.length, timer]);

    useEffect(() => {
        if (timer === 0) {
            clearCart();
            Alert.alert('Notification', 'Time expired, cart has been cleared!');
            setTimer(null);
        }
    }, [timer, clearCart]);

    const handleRemoveItem = (id) => {
        removeFromCart(id);
        if (cartItems.length === 1) {
            setTimer(null); // If last item, reset timer
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cart</Text>
            <ScrollView>
                {cartItems.map(item => (
                    <View key={item.id} style={styles.item}>
                        <Text>{item.name} - ${item.price} x {item.quantity}</Text>
                        <Text>Subtotal: ${item.price * item.quantity}</Text>
                        <MaterialIcons
                            name="delete"
                            size={24}
                            color="black"
                            onPress={() => handleRemoveItem(item.id)}  // Add onPress handler to delete icon
                            style={styles.deleteIcon}
                        />
                    </View>
                ))}
            </ScrollView>
            <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
            <Text style={styles.timer}>Time
                remaining: {timer ? `${Math.floor(timer / 60)}:${('0' + timer % 60).slice(-2)}` : 'No active timer'}</Text>
            <View style={styles.buttonContainer}>
                {/*<Button title="Buy Items" onPress={() => navigation.navigate('Checkout')}/>*/}
                <CheckoutScreen/>
            </View>
            <View style={[styles.buttonContainer, {marginTop: 5}]}>
                <Button title="Clear Cart" onPress={() => {
                    clearCart();
                    setTimer(null);
                }}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginBottom: 5,
        marginTop: 5,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    timer: {
        fontSize: 18,
        color: 'red',
        marginTop: 10,
    },
    deleteIcon: {
        padding: 8,
    },
});
