import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Button } from 'react-native';
import { useCart } from "../../../Context/CartContext";
import CheckoutScreen from "../../CheckoutScreen/CheckoutScreen";

const ProductModal = ({ visible, onClose, products, vendingMachineId }) => {
    const [quantities, setQuantities] = useState(products.reduce((acc, product) => {
        acc[product.id] = 0;  // Start all quantities at 0
        return acc;
    }, {}));
    const { addToCart } = useCart();

    const handleQuantityChange = (id, delta) => {
        setQuantities(currentQuantities => ({
            ...currentQuantities,
            [id]: Math.max(0, Math.min(3, currentQuantities[id] + delta))  // Ensure quantity stays within 0-3
        }));
    };

    const handleAddToCart = () => {
        const itemsToAdd = products.filter(product => quantities[product.id] > 0)
            .map(product => ({
                ...product,
                quantity: quantities[product.id]
            }));
        addToCart(itemsToAdd);
        onClose();  // Optionally close the modal after adding to cart
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
                                source={require('../../../../assets/images/drug.png')}
                                style={styles.productImage}
                            />
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>{product.price}₮</Text>
                            <View style={styles.quantityContainer}>
                                <View style={styles.buttonWrapper}>
                                    <Button title="-" onPress={() => handleQuantityChange(product.id, -1)} />
                                </View>
                                <Text style={styles.quantityText}>{quantities[product.id]}</Text>
                                <View style={styles.buttonWrapper}>
                                    <Button title="+" onPress={() => handleQuantityChange(product.id, 1)} />
                                </View>
                            </View>
                            <CheckoutScreen
                                title={'Buy Now'}
                                items={[{
                                    item_id: product.id,
                                    quantity: quantities[product.id]
                                }]}
                                vendingMachineId={vendingMachineId}
                                disabled={quantities[product.id] === 0}
                            />
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
    buttonWrapper: {
        marginHorizontal: 5,  // Apply spacing between buttons
        width: 30,
        height: 30
    },
    quantityText: {
        minWidth: 10,  // Ensure text has space and is centered
        textAlign: 'center',
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
