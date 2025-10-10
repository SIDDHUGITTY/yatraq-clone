import React, { useEffect, useState } from 'react';
import { View,Text, StyleSheet, Alert } from 'react-native';
import MapView,{ PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const GOOGLE_API_KEY = 'AIzaSyDZNKiJhmxhMP0TikvbX6zCMef-1SlUwHQ'; 

const MapComponent = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [busStops, setBusStops] = useState<any[]>([]); // storing bus stops from Google

  useEffect(() => {
    //permition
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need location permission to show your position.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

    // Fetch nearby bus station
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${loc.coords.latitude},${loc.coords.longitude}&radius=2000&type=bus_station&key=${GOOGLE_API_KEY}`
      );
      const {results} = await response.json();
      console.log("Full response:", await response.json());
      console.log("Bus Stops:", results);
      setBusStops(results); // Save to state
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={true}
        region={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 17.385044, // fallback to Hyderabad
                longitude: 78.486671,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
        }
      >
        <Text className='bg-red-500 text-center mt-[50%] text-5xl z-10'>helo</Text>
        {busStops.map((stop, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: stop.geometry.location.lat,
              longitude: stop.geometry.location.lng,
            }}
            title={stop.name}
            description={stop.vicinity}
          />
        ))}

        {/* Optional: Add a custom marker for current location }
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
          />
        )*/}
        
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapComponent;
