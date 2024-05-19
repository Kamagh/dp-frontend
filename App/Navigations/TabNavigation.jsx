import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from "../Screen/HomeScreen/HomeScreen";
import CartScreen from "../Screen/CartScreen/CartScreen";
import {FontAwesome5, Ionicons} from '@expo/vector-icons';
import Colors from "../Utils/Colors";
import QRButton from "../Components/QRButton/QRButton";
import { ModernQRScanner } from 'react-native-modern-qrscanner';

const Tab = createBottomTabNavigator();

export default function TabNavigation({navigation}) {
    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name='Map'
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Map',
                        tabBarActiveTintColor: Colors.PRIMARY,
                        tabBarIcon: ({color, size}) => (
                            <FontAwesome5 name="map-marked-alt" size={size} color={color}/>
                        )
                    }}
                />
                <Tab.Screen
                    name='Cart'
                    component={CartScreen}
                    options={{
                        tabBarLabel: 'Cart',
                        tabBarActiveTintColor: Colors.PRIMARY,
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="cart" size={size} color={color}/>
                        )
                    }}
                />
            </Tab.Navigator>
            <QRButton onPress={() => navigation.navigate('ScanQR')} />
            {/*<QRButton onPress={() => (*/}
            {/*    <ModernQRScanner*/}
            {/*        onRead={(e) => console.log('QR code detected:', e)}*/}
            {/*    />)}/>*/}
        </>
    )
}

const styles = StyleSheet.create({
    tabContainer: {
        flex: 1,
        position: 'relative',
    },
});
