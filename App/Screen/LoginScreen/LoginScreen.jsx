import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../Context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();

    const login = async () => {
        const result = await onLogin(email, password);
        if (result && result.error) {
            alert(result.msg);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{}} style={styles.image} />
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder={'Email'}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <Button onPress={login} title={'Sign in'} />
                <Button onPress={() => navigation.navigate('SignUp')} title={'Sign up'} />
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
        width: '80%',
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
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
});

export default LoginScreen;
