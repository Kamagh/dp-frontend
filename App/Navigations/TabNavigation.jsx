import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from "../Screen/HomeScreen/HomeScreen";
import CartScreen from "../Screen/CartScreen/CartScreen";
import {FontAwesome5, Ionicons} from '@expo/vector-icons';
import Colors from "../Utils/Colors";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Tab.Screen
                name='Map'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Map',
                    tabBarActiveTintColor: Colors.PRIMARY,
                    tabBarIcon:({color, size}) => (
                        <FontAwesome5 name="map-marked-alt" size={size} color={color} />                    )
                }}
            />
            <Tab.Screen
                name='Cart'
                component={CartScreen}
                options={{
                    tabBarLabel: 'Cart',
                    tabBarActiveTintColor: Colors.PRIMARY,
                    tabBarIcon:({color, size}) => (
                        <Ionicons name="cart" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}