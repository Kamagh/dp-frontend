import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Button } from 'react-native';
import { useCart } from "../../../Context/CartContext";
import CheckoutScreen from "../../CheckoutScreen/CheckoutScreen";
import {getProductsByVendingMachine} from "../../../../api/api";
import {useAuth} from "../../../Context/AuthContext";


const ProductModal = ({ visible, onClose, vendingMachineId }) => {
    const { authState } = useAuth();
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            if (visible && vendingMachineId) {
                try {
                    const fetchedProducts = await getProductsByVendingMachine(vendingMachineId, authState);
                    setProducts(fetchedProducts);
                    setQuantities(fetchedProducts.reduce((acc, product) => {
                        acc[product.item.id] = 0;  // Start all quantities at 0
                        return acc;
                    }, {}));
                } catch (error) {
                    console.error('Error fetching products:', error.message);
                }
            }
        };

        fetchProducts();
    }, [visible, vendingMachineId]);

    const handleQuantityChange = (id, delta) => {
        setQuantities(currentQuantities => ({
            ...currentQuantities,
            [id]: Math.max(0, Math.min(3, currentQuantities[id] + delta))  // Ensure quantity stays within 0-3
        }));
    };

    const handleAddToCart = () => {
        const itemsToAdd = products.filter(product => quantities[product.item.id] > 0)
            .map(product => ({
                ...product,
                quantity: quantities[product.item.id]
            }));
        addToCart(itemsToAdd);
        onClose();  // Optionally close the modal after adding to cart
    };

    // Function to dynamically require images based on the path
    const getImage = (imagePath) => {
        const imageName = imagePath.split('/').pop().split('.')[0]; // Get the image name without extension
        return images[imageName] || require('../../../../assets/images/drug.png'); // Fallback image if not found
    };

    console.log('products', products[0]?.item.product.image);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {products.map(({ item }) => (
                        <View key={item.id} style={styles.productCard}>
                            <Image
                                source={getImage(item.product.image)}
                                style={styles.productImage}
                            />
                            <Text style={styles.productName}>{item.product.name}</Text>
                            <Text style={styles.productPrice}>{item.price}₮</Text>
                            <Text style={styles.productDetails}>Dose: {item.dose.amount} {item.dose.unit}</Text>
                            <Text style={styles.productDetails}>Type: {item.type}</Text>
                            <Text style={styles.productDetails}>Instruction: {item.product.instruction}</Text>
                            <Text style={styles.productDetails}>Storage: {item.product.storage_condition}</Text>
                            <Text style={styles.productDetails}>Contraindication: {item.product.contraindication}</Text>
                            <Text style={styles.productDetails}>Composition: {item.product.composition}</Text>
                            <View style={styles.quantityContainer}>
                                <View style={styles.buttonWrapper}>
                                    <Button title="-" onPress={() => handleQuantityChange(item.id, -1)} />
                                </View>
                                <Text style={styles.quantityText}>{quantities[item.id]}</Text>
                                <View style={styles.buttonWrapper}>
                                    <Button title="+" onPress={() => handleQuantityChange(item.id, 1)} />
                                </View>
                            </View>
                            <CheckoutScreen
                                title={'Buy Now'}
                                items={products.map(product => ({
                                    item_id: product.item.id,
                                    item_name: product.item.product.name,
                                    quantity: quantities[product.item.id]
                                }))}
                                vendingMachineId={vendingMachineId}
                                disabled={products.every(product => quantities[product.item.id] === 0)}
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
    productDetails: {
        fontSize: 12,
        marginBottom: 5,
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
