import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Button } from 'react-native';
import {useCart} from "../../../Context/CartContext";

const ProductModal = ({ visible, onClose, products }) => {
    // Initialize state to keep track of quantities for each product
    const [quantities, setQuantities] = useState(products.reduce((acc, product) => {
        acc[product.id] = 0; // Start all quantities at 0
        return acc;
    }, {}));
    const { addToCart } = useCart();

    // Function to handle quantity changes
    const handleQuantityChange = (id, delta) => {
        setQuantities(currentQuantities => ({
            ...currentQuantities,
            [id]: Math.max(0, Math.min(3, currentQuantities[id] + delta)) // Ensure quantity stays within 0-3
        }));
    };

    // Function to add items to cart
    const handleAddToCart = () => {
        const itemsToAdd = products.filter(product => quantities[product.id] > 0)
            .map(product => ({
                ...product,
                quantity: quantities[product.id]
            }));
        addToCart(itemsToAdd);
        onClose(); // Optionally close the modal after adding to cart
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {products.map((product) => (
                        <View key={product.id} style={styles.productCard}>
                            <Image
                                source={{ uri: product.image }} // Replace with actual image path or require statement
                                style={styles.productImage}
                            />
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>{product.price}₮</Text>
                            <View style={styles.quantityContainer}>
                                <Button title="-" onPress={() => handleQuantityChange(product.id, -1)} />
                                <Text>{quantities[product.id]}</Text>
                                <Button title="+" onPress={() => handleQuantityChange(product.id, 1)} />
                            </View>
                            <Button title="Buy Now" onPress={() => console.log('Purchased:', product)} />
                        </View>
                    ))}
                </ScrollView>
                <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
                    <Text>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        marginTop: 50,
        backgroundColor: "white",
        padding: 20,
    },
    scrollView: {
        alignItems: 'center',
    },
    productCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
        width: 250,
    },
    productImage: {
        width: 120,
        height: 120,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    productPrice: {
        fontSize: 14,
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    addToCartButton: {
        backgroundColor: '#DDDDDD',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
    },
});

export default ProductModal;
