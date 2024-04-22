import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Text} from 'react-native';
import LoginScreen from "./App/Screen/LoginScreen/LoginScreen";
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, {useCallback} from "react";
import {ClerkProvider, SignedIn, SignedOut} from "@clerk/clerk-expo";

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded, fontError] = useFonts({
        'outfit': require('./assets/fonts/Outfit-Regular.ttf'),
        'outfit-medium': require('./assets/fonts/Outfit-SemiBold.ttf'),
        'outfit-bold': require('./assets/fonts/Outfit-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ClerkProvider publishableKey={'pk_test_Y2VydGFpbi1ibG93ZmlzaC04MC5jbGVyay5hY2NvdW50cy5kZXYk'}>
            <View style={styles.container} onLayout={onLayoutRootView}>
                <SignedIn>
                    <Text>You are Signed in</Text>
                </SignedIn>
                <SignedOut>
                    <LoginScreen/>
                </SignedOut>
                <StatusBar style="auto"/>
            </View>
        </ClerkProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 25,
    },
});
