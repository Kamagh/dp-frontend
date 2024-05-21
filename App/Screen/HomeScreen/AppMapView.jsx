import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useContext, useEffect, useRef, useState } from 'react';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewStyle from '../../Utils/MapViewStyle.json';
import { UserLocationContext } from "../../Context/UserLocationContext";
import { useNavigation } from "@react-navigation/native";
import ProductModal from "./components/ProductModal";
import { MaterialIcons } from "@expo/vector-icons";
import { getDispensers } from "../../../api/api";
import { useAuth } from "../../Context/AuthContext";

export default function AppMapView() {
    const { authState } = useAuth();
    const { location, setLocation } = useContext(UserLocationContext);

    const initialRegion = {
        latitude: location ? location.latitude : 40.1931,
        longitude: location ? location.longitude : 44.5044,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    };

    const mapRef = useRef(null);
    const navigation = useNavigation();
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [dispensers, setDispensers] = useState([]);
    const [region, setRegion] = useState([]);

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
                    <View style={{ padding: 10 }}>
                        <Text>Focus</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }, []);

    const fetchDispensers = async (bounds) => {
        try {
            const data = await getDispensers(bounds, authState);
            setDispensers(data);
        } catch (error) {
            console.error('Error fetching dispensers:', error.message);
        }
    };

    const onRegionChangeComplete = async (region) => {
        console.log("onRegionChangeComplete", await mapRef.current.getMapBoundaries());
        const bounds = await mapRef.current.getMapBoundaries();
        fetchDispensers(bounds);
        setRegion(region);
    };

    const focusMap = () => {
        const GreenBayStadium = {
            latitude: 44.5013,
            longitude: -88.0622,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
        };

        mapRef.current?.animateToRegion(GreenBayStadium);
    };

    const handleMarkerPress = (pharmacy) => {
        setSelectedPharmacy(pharmacy);
    };

    return location?.latitude && (
        <View>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton
                customMapStyle={MapViewStyle}
                onRegionChangeComplete={onRegionChangeComplete}
            >
                <Marker coordinate={{
                    latitude: location?.latitude, longitude: location?.longitude,
                }}>
                    <Image source={require('../../../assets/images/5509741.png')}
                           style={{ width: 60, height: 60 }}
                    />
                </Marker>

                {dispensers.map((pharmacy, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: pharmacy.location.latitude,
                            longitude: pharmacy.location.longitude,
                        }}
                        title={pharmacy.address.address}
                    >
                        <MaterialIcons name="local-pharmacy" size={40} color="green" />
                        <Callout onPress={() => handleMarkerPress(pharmacy)}>
                            <View style={styles.calloutView}>
                                <WebView
                                    source={require('../../../assets/images/illustrations/pharmacy1.png')}
                                    style={styles.fullImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.overlayText}>
                                    <Text style={styles.calloutTitle}>{pharmacy.address.address}</Text>
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
                    vendingMachineId={selectedPharmacy.id}
                />
            )}
        </View>
    );
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
