import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import {useCart} from "../../Context/CartContext";

export default function CartScreen() {
    // Example cart items (You would fetch this data from your context or navigation param)
    const { cartItems, clearCart, removeFromCart } = useCart(); // Assuming removeFromCart method exists in context
    const [timer, setTimer] = useState(null);

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    useEffect(() => {
        if (cartItems.length > 0 && timer === null) {
            setTimer(300); // Start the timer when items are added
        }

        const countdown = timer !== null ? setInterval(() => {
            setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : 0);
        }, 1000) : null;

        // Clear interval on component unmount or timer stop
        return () => countdown && clearInterval(countdown);
    }, [cartItems.length, timer]);

    // Clear cart when time expires
    useEffect(() => {
        if (timer === 0) {
            clearCart(); // Clear cart using context function
            alert('Time expired, cart has been cleared!');
        }
    }, [timer, clearCart]);

    const handleRemoveItem = (id) => {
        removeFromCart(id);
        if (cartItems.length === 1) { // Check if this was the last item
            setTimer(null); // Stop and reset timer if no items are left
        }
    };

    const handlePurchase = () => {
        alert('Purchase successful!');
        clearCart();
        setTimer(null); // Stop and reset timer after purchase
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cart</Text>
            <ScrollView>
                {cartItems.map(item => (
                    <View key={item.id} style={styles.item}>
                        <Text>{item.name} - ${item.price} x {item.quantity}</Text>
                        <Text>Subtotal: ${item.price * item.quantity}</Text>
                    </View>
                ))}
            </ScrollView>
            <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
            <Text style={styles.timer}>Time remaining: {timer ? `${Math.floor(timer / 60)}:${('0' + timer % 60).slice(-2)}` : 'No active timer'}</Text>
            <Button title="Buy Items" onPress={handlePurchase} />
            <Button title="Clear Cart"  onPress={() => { clearCart(); setTimer(null); }} />
        </View>
    );
}

const styles = StyleSheet.create({
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
});
