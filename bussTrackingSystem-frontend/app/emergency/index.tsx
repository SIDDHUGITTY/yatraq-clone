import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const EmergencyScreen = () => {
  const router = useRouter();
  const [location, setLocation] = useState<string>('Fetching location...');
  
  
  const contacts = [
    { name: "NHAI's highway helpline", phone: "1033"},
    { name: 'Ambulance', phone: '108'},
    { name: 'Fire Brigade', phone: '101' },
  ]

  // Fetch live location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        let addr = reverseGeocode[0];
        setLocation(`${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.postalCode || ''}`);
      } else {
        setLocation(`Lat: ${loc.coords.latitude}, Lng: ${loc.coords.longitude}`);
      }
    })();
  }, []);

  const emergencyOptions = [
    {
      label: 'Women Safety',
      icon: <Image source={require('../../assets/images/womensefty.jpg')} className="w-20 h-20" />,
      route: '/emergency/women-safety',
    },
    {
      label: 'Report Breakdown',
      icon: <Image source={require('../../assets/images/breakdown.jpg')} className="w-20 h-20" />,
      route: '/emergency/report-breakdown',
    },
    {
      label: 'Medical Assistance',
      icon: <Image source={require('../../assets/images/medical.jpg')} className="w-20 h-20" />,
      route: '/emergency/medical-assistance',
    },
    {
      label: 'Report Accident',
      icon: <Image source={require('../../assets/images/accident.jpg')} className="w-20 h-20" />,
      route: '/emergency/report-accident',
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="py-10 px-8 bg-white">
      <View className="px-6 flex-1 border border-gray-300 rounded-2xl overflow-hidden">
        {/* Live Location */}
        <Text className="text-xl font-bold text-gray-800 text-center mt-4 mb-2">Your Live Location</Text>
        <Text className="text-center text-gray-600 text-sm px-4">{location}</Text>

        {/* Emergency Options */}
        <Text className="text-2xl font-bold text-gray-800 text-center mt-8 mb-4">Emergency</Text>
        <View className="flex-row flex-wrap justify-between px-3 py-2">
          {emergencyOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] h-32 bg-white rounded-xl border border-gray-100 shadow-sm mb-4 items-center justify-center"
              onPress={() => router.push(item.route as any)}
            >
              <View className="mb-2">{item.icon}</View>
              <Text className="text-sm text-black font-medium text-center">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contacts */}
        <Text className="text-xl font-bold text-gray-800 text-center mt-8 mb-4">Emergency Contacts</Text>
        {contacts.map((contact, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => Linking.openURL(`tel:${contact.phone}`)}
            className="flex-row justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-3 mb-2"
          >
            <Text className="text-gray-800 font-medium">{contact.name}</Text>
            <Text className="text-blue-600 font-semibold">{contact.phone}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default EmergencyScreen;
