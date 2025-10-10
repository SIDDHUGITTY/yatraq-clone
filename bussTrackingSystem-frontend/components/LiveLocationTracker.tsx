import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';

export default function LocationComponent() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      Alert.alert('Permission Denied', 'Allow location access from settings');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log('Latitude:', location.coords.latitude);
    console.log('Longitude:', location.coords.longitude);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View className="p-4">
      <Text className="text-lg font-bold mb-2">📍 Current Location</Text>
      {location ? (
        <View>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      ) : (
        <Text>{errorMsg || 'Fetching location...'}</Text>
      )}

      <Button title="Refresh Location" onPress={getLocation} />
    </View>
  );
}
