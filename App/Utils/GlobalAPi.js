const BASE_URL = 'https://places.googleapis.com/v1/places:searchNearby\n';
const API_KEY = 'AIzaSyAty0r5wHOXSwEEggsARL33tWguPC7nEAw';

const config = {
    headers: {
        'content-type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': [
            'places.displayName',
            'places.location',
            'places.evChargerOptions',
            'places.photos'
        ]
    }
}
