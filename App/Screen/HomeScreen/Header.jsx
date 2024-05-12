import {Image, View, StyleSheet} from 'react-native'
import React from 'react'
import {useUser} from "@clerk/clerk-expo";
import { FontAwesome } from '@expo/vector-icons';
import Colors from "../../Utils/Colors";

export default function Header() {
    // const {user} = useUser();

    return (
        <View>
            {/*<Image source={{uri: user?.imageUrl}}*/}
            {/*       style={{width: 45, height: 45, borderRadius: 99}}/>*/}
            {/*<Image source={require('../../../assets/images/logo.png')}*/}
            {/*       style={{width: 45, height: 45}}/>*/}
            {/*<FontAwesome name='filter' size={26} color='white'/>*/}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE_TRANSPARENT
    }
})