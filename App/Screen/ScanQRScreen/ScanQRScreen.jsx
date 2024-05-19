import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ModernQRScanner } from 'react-native-modern-qrscanner';

const ScanQRScreen = ({ navigation }) => {
    const handleQRCodeRead = (e) => {
        console.log('QR code detected:', e);
        // You can also navigate to another screen or perform other actions here
        navigation.goBack(); // Go back to the previous screen after scanning
    };

    return (
        <View style={styles.container}>
            <ModernQRScanner onRead={handleQRCodeRead} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ScanQRScreen;
