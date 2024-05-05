import {View, Text} from 'react-native'
import React from 'react'
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

export default function SearchBar({searchedLocation}) {
    return (
        <View>
            <GooglePlacesAutocomplete
                placeholder='Search'
                fetchDetails={true}
                enablePoweredByContainer={false}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    searchedLocation(details?.geometry?.location)
                    console.log(data, details);
                }}
                query={{
                    key: 'AIzaSyCsLF7G8azKLfsWm3RLn5h-t_tulBMowP4',
                    language: 'en',
                }}
            />
        </View>
    )
}
