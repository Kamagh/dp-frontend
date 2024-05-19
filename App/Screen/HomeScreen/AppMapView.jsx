import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { WebView } from 'react-native-webview';
import React, {useContext, useEffect, useRef, useState} from 'react'
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from "react-native-maps";
import MapViewStyle from '../../Utils/MapViewStyle.json'
import {UserLocationContext} from "../../Context/UserLocationContext";
import mockPharmacyData from "../../data/mockPharmacyData";
import {useNavigation} from "@react-navigation/native";
import ProductModal from "./components/ProductModal";
import {MaterialIcons} from "@expo/vector-icons";


export default function AppMapView() {
    const initialRegion = {
        latitude: location ? location.latitude : 40.8789533,  // Fallback to default coords if location is not available
        longitude: location ? location.longitude : 45.1470833,
        latitudeDelta: 0.01,  // Smaller delta for closer zoom
        longitudeDelta: 0.01
    };

    const mapRef = useRef(null);
    const navigation = useNavigation();
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const {location, setLocation} = useContext(UserLocationContext)

    useEffect(() => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                ...initialRegion,
                latitude: location.latitude,
                longitude: location.longitude
            }, 1000);  // Animate to new region over 1 second
        }
    }, [location]);  // Re-run effect if location changes

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={focusMap}>
                    <View style={{padding: 10}}>
                        <Text>Focus</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }, []);

    const focusMap = () => {
        const GreenBayStadium = {
            latitude: 44.5013,
            longitude: -88.0622,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
        };

        mapRef.current?.animateToRegion(GreenBayStadium);
    }

    const handleMarkerPress = (pharmacy) => {
        setSelectedPharmacy(pharmacy);
    };

    const onRegionChange = (region) => {
        console.log('region', region);
    };

    return location?.latitude && (<View>
        <MapView style={styles.map}
                 initialRegion={initialRegion}
                 provider={PROVIDER_GOOGLE}
                 showsUserLocation
                 showsMyLocationButton
                 customMapStyle={MapViewStyle}
                 onRegionChangeComplete={onRegionChange}
        >
            <Marker coordinate={{
                latitude: location?.latitude, longitude: location?.longitude,

            }}>
                <Image source={require('../../../assets/images/5509741.png')}
                       style={{width: 60, height: 60}}
                />
            </Marker>

            {mockPharmacyData.map((pharmacy, index) => (
                <Marker
                    key={index}
                    coordinate={{
                        latitude: pharmacy.latitude,
                        longitude: pharmacy.longitude
                    }}
                    title={pharmacy.name}
                >
                    <MaterialIcons name="local-pharmacy" size={40} color="green"/>
                    <Callout onPress={() => handleMarkerPress(pharmacy)}>
                        <View style={styles.calloutView}>
                                <WebView
                                    // source={{ uri: 'https://ajp.com.au/wp-content/uploads/2023/02/158430627_l.jpg' }}
                                    source={require('../../../assets/images/illustrations/pharmacy1.png')}
                                    style={styles.fullImage}
                                    resizeMode="cover"
                                />
                            <View style={styles.overlayText}>
                                <Text style={styles.calloutTitle}>{pharmacy.name}</Text>
                                <Text style={styles.detailsText}>Tap here for details!</Text>
                            </View>
                        </View>
                    </Callout>
                </Marker>
            ))}

        </MapView>
        {selectedPharmacy && (
            <ProductModal
                visible={!!selectedPharmacy}
                onClose={() => setSelectedPharmacy(null)}
                products={selectedPharmacy.products}
            />
        )}
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, map: {
        width: '100%', height: '100%',
    },

    calloutView: {
        position: 'relative',
        width: 150, // Set the width of the image
        height: 150, // Set the height of the image
    },
    fullImage: {
        width: '100%',
        height: '100%'
    },
    overlayText: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
        padding: 10,
        textAlign: 'center', // Center the text within the overlay
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black' // Ensure text color is visible on a light background
    },
    detailsText: {
        color: 'black' // Ensure text color is visible
    }
});