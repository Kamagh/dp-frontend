import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import Colors from "../../Utils/Colors";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../../../hooks/useWarmUpBrowser';
import {useOAuth} from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginScreen() {
    // useWarmUpBrowser();
    //
    // const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    //
    // const onPress = async () => {
    //     try {
    //         const { createdSessionId, signIn, signUp, setActive } =
    //             await startOAuthFlow();
    //
    //         if (createdSessionId) {
    //             setActive({ session: createdSessionId });
    //         } else {
    //             // Use signIn or signUp for next steps such as MFA
    //         }
    //     } catch (err) {
    //         console.error("OAuth error", err);
    //     }
    // }
    // return (
    //     <View style={{
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         marginTop: 50
    //     }}>
    //         <Image source={require('../../../assets/images/logo.png')} style={styles.bgImage}/>
    //         <View style={{padding: 20}}>
    //             <Text style={styles.heading}>Remote Emergency Pharmacies</Text>
    //             <Text style={styles.desc}>Find Remote Emergency Pharmacies near you</Text>
    //         </View>
    //         <TouchableOpacity style={styles.button} onPress={onPress}>
    //             <Text style={{
    //                 color: Colors.WHITE,
    //                 textAlign: 'center',
    //                 fontFamily: 'outfit',
    //                 fontSize: 17
    //             }}>Login With Google</Text>
    //         </TouchableOpacity>
    //     </View>
    // )
}


const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 40,
        objectFit: 'contain',
    },
    bgImage: {
        width: '100%',
        height: 220,
        marginTop: 20,
        objectFit: 'cover',
    },
    heading: {
        fontSize: 25,
        fontFamily: 'outfit-bold',
        textAlign: 'center',
        marginTop: 20
    },
    desc: {
        fontSize: 17,
        fontFamily: 'outfit',
        marginTop: 15,
        textAlign: 'center',
        color: Colors.gray,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 16,
        display: 'flex',
        borderRadius: 99,
        marginTop: 40,
    }
})
