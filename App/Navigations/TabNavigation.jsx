import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from "../Screen/HomeScreen/HomeScreen";
import ProfileScreen from "../Screen/ProfileScreen/ProfileScreen";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../Utils/Colors";

const Tab = createBottomTabNavigator();
export default function TabNavigation() {
    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Tab.Screen
                name='Search'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarActiveTintColor: Colors.PRIMARY,
                    tabBarIcon:({color, size}) => (
                        <Ionicons name="search" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name='profile'
                component={ProfileScreen}
            />
        </Tab.Navigator>
    )
}