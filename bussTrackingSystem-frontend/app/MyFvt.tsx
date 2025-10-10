import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MyFvt = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const favoriteBuses = [
        {
            busNumber: 'TS1111',
            basicInfo: {
                driverName: 'Raju',
                conductor: 'Laxman',
                busType: 'Palle Velugu',
                routeName: 'Hanamkonda to Warangal',
                busStatus: 'Running',
            },
            moreInfo: {
                currentStop: 'Kazipet X Road',
                nextStop: 'Fathe Sagar',
                isFavorite: true,
            },
        },
        {
            busNumber: 'TS2222',
            basicInfo: {
                driverName: 'Mahesh',
                conductor: 'Suresh',
                busType: 'Express',
                routeName: 'Warangal to Hyderabad',
                busStatus: 'On Break',
            },
            moreInfo: {
                currentStop: 'Warangal Bus Stand',
                nextStop: 'Jangaon',
                isFavorite: true,
            },
        },
        {
            busNumber: 'TS3333',
            basicInfo: {
                driverName: 'Arjun',
                conductor: 'Venky',
                busType: 'Deluxe',
                routeName: 'Hanamkonda to Karimnagar',
                busStatus: 'Not Yet Started',
            },
            moreInfo: {
                currentStop: 'Hanamkonda Bus Stand',
                nextStop: 'Kazipet',
                isFavorite: false, // not fav, won’t show
            },
        },
    ];

    // Filter: only favorites + matches search term
    const filteredFavorites = favoriteBuses
        .filter(bus => bus.moreInfo.isFavorite)
        .filter(bus => {
            const combined = `${bus.busNumber} ${bus.basicInfo.driverName} ${bus.basicInfo.routeName} ${bus.moreInfo.currentStop}`.toLowerCase();
            return combined.includes(searchTerm.toLowerCase());
        });

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold mb-4 text-black">My Favorite Buses ❤️</Text>

            <TextInput
                placeholder="Search favorites..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="bg-gray-200 p-3 rounded-lg mb-4"
            />

            <ScrollView>
                {filteredFavorites.length === 0 ? (
                    <Text className="text-center text-gray-500 mt-10">No favorites found 😢</Text>
                ) : (
                    filteredFavorites.map((bus, index) => (
                        <View key={index} className="bg-yellow-100 p-4 rounded-xl mb-4 border border-yellow-400">
                            <Text className="text-xl font-bold text-yellow-700">🚌 {bus.busNumber}</Text>
                            <Text className="text-black">Driver: {bus.basicInfo.driverName}</Text>
                            <Text className="text-black">Route: {bus.basicInfo.routeName}</Text>
                            <Text className="text-black">Current Stop: {bus.moreInfo.currentStop}</Text>
                            <Text className="text-black">Next Stop: {bus.moreInfo.nextStop}</Text>
                            <Text className="text-black">Status: {bus.basicInfo.busStatus}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <TouchableOpacity
                onPress={() => router.back()}
                className="my-6 bg-blue-600 py-4 rounded-xl"
            >
                <Text className="text-white text-center font-semibold">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MyFvt;
