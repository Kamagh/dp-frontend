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
import LoginScreen from "./App/Screen/LoginScreen/LoginScreen"; // Ensure this path is correct

// Import custom fonts, replace these paths with your actual font files
const customFonts = {
    'outfit': require('./assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./assets/fonts/Outfit-SemiBold.ttf'),
    'outfit-bold': require('./assets/fonts/Outfit-Bold.ttf'),
};

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export const Layout = () => {
    const { authState, onLogout } = useAuth();  // Make sure useAuth() provides these

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/*{authState?.authenticated ? (*/}
                    <Stack.Screen
                        name="Home"
                        component={TabNavigation}  // Make sure this component is correctly imported or defined
                        options={{
                            headerRight: () => <Button onPress={onLogout} title="Sign Out" />
                        }}
                    />
                {/*) : (*/}
                {/*    <Stack.Screen name="Login" component={LoginScreen} /> // Adjust the LoginScreen import based on your app setup*/}
                {/*)}*/}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    const [fontsLoaded, fontError] = useFonts(customFonts);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
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

    return (
        <AuthProvider>
            <UserLocationContext.Provider value={{ location, setLocation }}>
                <View style={styles.container} onLayout={onLayoutRootView}>
                    <Layout />
                    <StatusBar style="auto" />
                </View>
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
