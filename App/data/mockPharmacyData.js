export default [
    {
        id: 1,
        name: 'Pharmacy One',
        latitude: 40.8791 + (Math.random() * 0.05 - 0.025),  // Random location within a larger radius
        longitude: 45.1471 + (Math.random() * 0.05 - 0.025),
        products: [
            { id: 101, name: 'Aspirin', price: 7.99 },
            { id: 102, name: 'Tylenol', price: 9.49 },
            { id: 103, name: 'Band-Aids', price: 4.29 },
        ],
    },
    {
        id: 2,
        name: 'Pharmacy Two',
        latitude: 40.8791 + (Math.random() * 0.05 - 0.025),
        longitude: 45.1471 + (Math.random() * 0.05 - 0.025),
        products: [
            { id: 201, name: 'Cough Syrup', price: 11.49 },
            { id: 202, name: 'Ibuprofen', price: 15.99 },
            { id: 203, name: 'Antiseptic', price: 8.99 },
        ],
    },
    // Add more pharmacies
    ...Array.from({ length: 8 }, (_, i) => ({
        id: i + 3,
        name: `Pharmacy ${i + 3}`,
        latitude: 40.8791 + (Math.random() * 0.05 - 0.025),  // Larger variation for more spread
        longitude: 45.1471 + (Math.random() * 0.05 - 0.025),
        products: [
            { id: 300 + i * 3 + 1, name: 'Pain Reliever', price: 10 },
            { id: 300 + i * 3 + 2, name: 'Allergy Medicine', price: 10 },
            { id: 300 + i * 3 + 3, name: 'Antacid', price: 10 },
        ],
    })),
];
