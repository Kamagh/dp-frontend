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
            <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.welcomeText}>Welcome Back</Text>
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
                <Button onPress={login} title={'Sign in'} color="#007BFF" />
                <View style={styles.signupContainer}>
                    <Text>Don't have an account?</Text>
                    <Button onPress={() => navigation.navigate('SignUp')} title={'Sign up'} color="#007BFF" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    form: {
        width: '80%',
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    signupContainer: {
        marginTop: 10,
    },
});

export default LoginScreen;
