import { Feather } from '@expo/vector-icons';
import Constants from "expo-constants";
import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from "expo-router";
import { View } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";
import { io } from "socket.io-client";

const API_URL = Constants.expoConfig?.extra?.API_URL;
type Location = { lat: number; lng: number };

const LiveBusMap = () => {
  useKeepAwake(); // keeps screen on when this component is in active
  const { busId } = useLocalSearchParams<{ busId: string }>();
  const [busLocation, setBusLocation] = useState<Location | null>(null);
  console.log(busId, 'from map component')
  useEffect(() => {
    if (!busId) return; // Don't connect if busId is not available

    const socket = io(API_URL, {
      transports: ["websocket"],
      query: { role: "passenger", busId },
    });

    socket.on("connect", () => {
      console.log("✅ Passenger connected:", socket.id);
      socket.emit("joinBusRoom", { busId });
    });

    socket.on("busLocationUpdate", (data: Location) => {
      console.log("📍 Bus moved:", data, 'this is openning in map component..');
      setBusLocation(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [busId]);

  return (
    <View>
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        className="absolute top-3 left-5 z-10 bg-white/90 rounded-full p-2 shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Feather name="arrow-left" size={24} color="#1E40AF" />
      </Pressable>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={
          busLocation
            ? {
              latitude: busLocation.lat,
              longitude: busLocation.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }
            : {
              latitude: 17.385044,
              longitude: 78.486671,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }
        }
      >
        {busLocation && (
          <Marker
            coordinate={{
              latitude: busLocation.lat,
              longitude: busLocation.lng,
            }}
            title={`Bus ${busId}`}
            description="Live location"
          >
            <Icon name="bus" size={32} color="green" />
          </Marker>
        )}
      </MapView>
    </View>
  );
};

export default LiveBusMap;
