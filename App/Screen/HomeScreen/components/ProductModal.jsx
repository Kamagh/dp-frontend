import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

const ProductModal = ({ visible, onClose, products }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalView}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {products.map((product, index) => (
                        <View key={index} style={styles.productCard}>
                            <Image
                                source={require('../../../../assets/images/drug.png')}  // Ensure you have image URLs in your products
                                style={styles.productImage}
                            />
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>{product.price}₮</Text>
                        </View>
                    ))}
                </ScrollView>
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
    },
    scrollView: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    productCard: {
        flex: 1 / 2,  // Adjust based on desired number of columns
        aspectRatio: 1,
        margin: 5,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: '70%',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
    },
    closeButton: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#DDDDDD',
    },
    closeButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProductModal;
