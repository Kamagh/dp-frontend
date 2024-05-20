import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Button, StyleSheet, View} from 'react-native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigation from "./App/Navigations/TabNavigation";
import * as Location from 'expo-location';
import {UserLocationContext} from "./App/Context/UserLocationContext";
import {AuthProvider, useAuth} from './App/Context/AuthContext';
import LoginScreen from "./App/Screen/LoginScreen/LoginScreen";
import SignUpScreen from "./App/Screen/LoginScreen/SignUpScreen";
import {CartProvider} from "./App/Context/CartContext";
import {StripeProvider} from "@stripe/stripe-react-native";
import {LogBox} from 'react-native';
import ScanQRScreen from "./App/Screen/ScanQRScreen/ScanQRScreen";

LogBox.ignoreAllLogs();

// Import custom fonts, replace these paths with your actual font files
const customFonts = {
    'outfit': require('./assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./assets/fonts/Outfit-SemiBold.ttf'),
    'outfit-bold': require('./assets/fonts/Outfit-Bold.ttf'),
};

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export const Layout = () => {
    const {authState, onLogout} = useAuth();  // Make sure useAuth() provides these

    return (
        <Stack.Navigator>
            {authState?.authenticated ? (
                <>
                    <Stack.Screen
                        name="Emergency Pharmacies"
                        component={TabNavigation} // Make sure this component is correctly imported or defined
                        options={{
                            headerRight: () => <Button onPress={onLogout} title="Sign Out"/>
                        }}
                    />
                    {/*<Stack.Screen name="ScanQR" component={ScanQRScreen} />*/}
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen}/>
                    <Stack.Screen name="SignUp" component={SignUpScreen}/>
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    const [fontsLoaded, fontError] = useFonts(customFonts);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null; // Still loading or font load error
    }


    // Add this in node_modules/react-dom/index.js
    window.React1 = require('react');

    // Add this in your component file
    require('react-dom');
    window.React2 = require('react');
    console.log(window.React1 === window.React2);

    return (
        <AuthProvider>
            <UserLocationContext.Provider value={{location, setLocation}}>
                <StripeProvider
                    publishableKey={'pk_test_51PHlUzRrbwwoFbowcAJKktlP9zF7tuDDF85pECXLd20OLLJ36jvpt3IzSfq4XK3MTpAhNAXlP0VV0sZ4MsKm6oze00R9FNLRXM'}>
                    <CartProvider>
                        <View style={styles.container} onLayout={onLayoutRootView}>
                            <NavigationContainer>
                                <Layout/>
                                <StatusBar style="auto"/>
                            </NavigationContainer>
                        </View>
                    </CartProvider>
                </StripeProvider>
            </UserLocationContext.Provider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 25,
    },
});
