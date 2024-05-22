import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

const API_URL = 'https://a0ef-5-77-254-89.ngrok-free.app/api';

const PurchaseHistoryScreen = () => {
    const { authState } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/orderHistory`, {
                    params: { page },
                    headers: {
                        'Authorization': `Bearer ${authState.token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching order history:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page, authState.token]);

    const renderOrder = ({ item }) => (
        <View style={styles.orderContainer}>
            <Text style={styles.orderText}>Order ID: {item.id}</Text>
            <Text style={styles.orderText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.orderText}>Total: ${item.total}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => setPage(page + 1)}
                    onEndReachedThreshold={0.5}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    orderContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    orderText: {
        fontSize: 16,
    },
});

export default PurchaseHistoryScreen;
