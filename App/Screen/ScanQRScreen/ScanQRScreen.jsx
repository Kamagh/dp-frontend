import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import { lockVendingMachine } from "../../../api/api";
import { useAuth } from "../../Context/AuthContext";

const ScanQRScreen = ({ navigation }) => { // Ensure navigation prop is received
    const { authState } = useAuth();
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleBarCodeScanned = async ({ data }) => {
        if (scanned) return;  // Prevent multiple scans
        setScanned(true);

        try {
            await lockVendingMachine(+data, authState);
            Alert.alert(
                'Success',
                `Vending machine ${data} locked successfully!`,
                [{
                    text: 'OK',
                    onPress: () => navigation.navigate('Map') // Navigate to ScanQR screen
                }]
            );
        } catch (error) {
            console.error('Error locking vending machine:', error.message);
            Alert.alert(
                'Error',
                'Failed to lock the vending machine.',
                [
                    {
                        text: 'Try Again',
                        onPress: () => setScanned(false) // Allow scanning again
                    },
                    {
                        text: 'Go Back',
                        onPress: () => navigation.goBack() // Navigate back
                    }
                ]
            );        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default ScanQRScreen;
