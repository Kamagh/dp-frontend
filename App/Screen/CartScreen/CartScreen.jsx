import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCart } from "../../Context/CartContext";
import { MaterialIcons } from '@expo/vector-icons';
import CheckoutScreen from "../CheckoutScreen/CheckoutScreen";

export default function CartScreen({ navigation }) {
    const { cartItems, clearCart, removeFromCart } = useCart();
    const [reservationStatus, setReservationStatus] = useState({});

    useEffect(() => {
        const timers = {};

        cartItems.forEach(item => {
            if (reservationStatus[item.id] && reservationStatus[item.id].remainingTime > 0) {
                timers[item.id] = setInterval(() => {
                    setReservationStatus(prevState => {
                        const newTime = prevState[item.id].remainingTime - 1;
                        if (newTime <= 0) {
                            clearInterval(timers[item.id]);
                            return {
                                ...prevState,
                                [item.id]: {
                                    ...prevState[item.id],
                                    remainingTime: 0,
                                    reserved: false,
                                    reservationsLeft: prevState[item.id].reservationsLeft - 1,
                                }
                            };
                        }
                        return {
                            ...prevState,
                            [item.id]: {
                                ...prevState[item.id],
                                remainingTime: newTime,
                            }
                        };
                    });
                }, 1000);
            }
        });

        return () => {
            Object.values(timers).forEach(clearInterval);
        };
    }, [cartItems, reservationStatus]);

    const handleReserveItem = (id) => {
        setReservationStatus(prevState => ({
            ...prevState,
            [id]: {
                reserved: true,
                remainingTime: 100, // 5 minutes
                reservationsLeft: prevState[id] ? prevState[id].reservationsLeft - 1 : 2, // Maximum 3 reservations per day
            }
        }));
    };

    const handleRemoveItem = (id) => {
        removeFromCart(id);
        setReservationStatus(prevState => {
            const { [id]: _, ...rest } = prevState;
            return rest;
        });
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cart</Text>
            <ScrollView>
                {cartItems.map(item => (
                    <View key={item.id} style={styles.item}>
                        <View style={styles.itemDetails}>
                            <Text>{item.name} - ${item.price} x {item.quantity}</Text>
                            <Text>Subtotal: ${item.price * item.quantity}</Text>
                        </View>
                        <MaterialIcons
                            name="delete"
                            size={24}
                            color="black"
                            onPress={() => handleRemoveItem(item.id)}
                            style={styles.deleteIcon}
                        />
                        <View style={styles.reserveContainer}>
                            {reservationStatus[item.id] && reservationStatus[item.id].reserved ? (
                                <Text style={styles.timer}>
                                    {Math.floor(reservationStatus[item.id].remainingTime / 60)}:{('0' + reservationStatus[item.id].remainingTime % 60).slice(-2)}
                                </Text>
                            ) : (
                                <Button
                                    title={reservationStatus[item.id] && reservationStatus[item.id].reservationsLeft <= 0 ? "No Reserves Left" : "Reserve"}
                                    onPress={() => handleReserveItem(item.id)}
                                    disabled={reservationStatus[item.id] && reservationStatus[item.id].reservationsLeft <= 0}
                                />
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
            <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
            <View style={styles.buttonContainer}>
                {/* <Button title="Buy Items" onPress={() => navigation.navigate('Checkout')}/> */}
                <CheckoutScreen
                    title="Checkout Cart"
                    items={cartItems.map(item => ({
                        item_id: item.id,
                        quantity: item.quantity
                    }))}
                    vendingMachineId={1} // Replace with actual vending machine ID
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Clear Cart" onPress={() => {
                    clearCart();
                    setReservationStatus({});
                }} />
            </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    itemDetails: {
        flex: 1,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    deleteIcon: {
        padding: 8,
    },
    reserveContainer: {
        alignItems: 'center',
    },
    timer: {
        fontSize: 18,
        color: 'red',
    },
    buttonContainer: {
        marginBottom: 5,
        marginTop: 5,
    },
});
