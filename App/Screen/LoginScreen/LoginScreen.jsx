import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Image} from 'react-native';
import { useAuth } from '../../Context/AuthContext'; // Ensure the path is correct based on your project structure

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin, onRegister } = useAuth();

    const login = async () => {
        const result = await onLogin(email, password);
        if (result && result.error) {
            alert(result.msg);
        }
    };

    const register = async () => {
        const result = await onRegister(email, password);
        if (result && result.error) {
            alert(result.msg);
        } else {
            login();
        }
    };


    return (
        <View style={styles.container}>
            <Image source={{}} style={styles.image}/>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder={'Email'} onChangeText={(text) => setEmail(text)} value={email}/>
                <TextInput style={styles.input} placeholder={'Password'} secureTextEntry={true} onChangeText={(text) => setPassword(text)} value={password}/>
                <Button onPress={login} title={'Sign in'}/>
                <Button onPress={register} title={'Sign up'}/>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    image: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
    },
    form: {
        gap: 10,
        width: '60%',
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
    container: {
        alignItems: 'center',
        width: '100%',
    },
});

export default LoginScreen;
