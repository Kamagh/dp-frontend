import {StyleSheet, View} from 'react-native'
import React, {useEffect} from 'react'
import AppMapView from "./AppMapView";
import Header from "./Header";
import SearchBar from "./SearchBar";

export default function HomeScreen() {

    useEffect(() => {
        const testCall = async () => {
            const result = await axios.get(`${API_URL}/users`);
            console.log("🐛 file: Login.tsx:16 ~ testCall ~ result:", result);
        };

        testCall();
    }, []);

    return (
        <View>
            <View style={styles.headerContainer}>
                <Header/>
                <SearchBar searchedLocation={(location) => console.log(location)}/>
            </View>
            <AppMapView/>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        zIndex: 10,
        padding: 10,
        width: '100%',
        paddingHorizontal: 20

    }
})