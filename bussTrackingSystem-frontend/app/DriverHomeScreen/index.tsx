import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';
import * as Location from "expo-location";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useToast } from "react-native-toast-notifications";
import io from "socket.io-client";
import LoadingAnime from "../../components/LoadingAnime";
import WelcomeSection from "../../components/WelcomeSection";


export default function DriverDashboard() {
  const LOCATION_TASK_NAME = "driver-location-task";
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const [tripActive, setTripActive] = useState(false);
  const [Loading, setLoading] = useState(false)
  const [driverData, setDriverData] = useState<DriverApiResponse | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const socketRef = useRef<any>(null);
  const locationTimerRef = useRef<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const toast = useToast();
  const [user, setUser] = useState<any>(null);

  interface Stop {
    status: string;
    stop_name: string;
    arrival_time: string;
    departure_time: string;
  }
  interface Assignment {
    bus_number: string;
    bus_type: string;
    capacity: number;
    status: string;
    depo_code_number: string;
    depo_name: string;
    depo_location: string;
    assigned_date: string;
    shift_time: string;
    route_name: string;
    source_location: string;
    destination_location: string;
    stops: Stop[];
  }
  interface Driver {
    Create_At: string;
    DateofBirth: string;
    Gender: string;
    Update_At: string;
    email: string;
    fullname: string;
    id: number;
    phone: string;
    profile_url: string;
    role: string;
    stops: Stop[];
  }
  interface DriverApiResponse {
    assignment: Assignment | null
    driver: Driver;
    message: string;
    success: boolean;
  }
  interface MyJwtPayload {
    name: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    role: string;
    profile: string;
    phone: string;
    iat: number;
    exp: number;
  }
  type LocationCoords = {
    lat: number;
    lng: number;
  } | string | null;

  //token and user details
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('access_token');
      if (storedToken) {
        setLoading(true);
        const decoded = jwtDecode<MyJwtPayload>(storedToken);
        setUser(decoded);
        try {
          const { data } = await axios.get(`${API_URL}/driver/create-driver?phone=${decoded.phone}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setDriverData(data);
          console.log(data?.assignment?.bus_number,'from driver screen')
          // derive a stable per-driver room id (prefer driver id, fallback to phone)
          const derivedRoomId = (data?.assignment?.bus_number ? String(data.assignment.bus_number) : decoded.phone) || null;
          setRoomId(derivedRoomId);

          Toast.show({
            type: "success",
            text1: `${data?.message}, 'Driver loaded'`,
            visibilityTime: 3000,
            autoHide: true,
          });
          setLoading(false);
        } catch (err) {
          console.log(err, 'from catch');
          Toast.show({
            type: "error",
            text1: `Error!, ${err}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          setLoading(false);
        }
      }
    };

    fetchToken();
  }, []);

  //websockets here
  const startShering = async () => {
    if (!API_URL) {
      Toast.show({ type: "error", text1: "API_URL not configured" });
      return;
    }
    if (!roomId) {
      Toast.show({ type: "error", text1: "Driver room not ready yet" });
      return;
    }

    // Avoid duplicate connections/intervals
    if (socketRef.current) {
      try { socketRef.current.disconnect(); } catch {}
      socketRef.current = null;
    }
    if (locationTimerRef.current) {
      clearInterval(locationTimerRef.current);
      locationTimerRef.current = null;
    }

    const socket = io(API_URL, {
      transports: ["websocket"],
      query: { role: "driver", busId: roomId }
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      // Optional: also explicitly join a room via event if your server expects it
      socket.emit("joinBusRoom", { busId: roomId });
    });

    socket.on("busLocationUpdate", (data: any) => {
      console.log("Live bus location:", data);
    });

    // Request GPS permission & start interval
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    locationTimerRef.current = setInterval(async () => {
      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      };
      setLocation(coords);
      // Send location to backend to the specific bus room
      socket.emit("sendLocation", { busId: roomId, ...coords });
    }, 10000);
  }

  // Start Trip Handler
  const startTrip = async () => {
    if (driverData?.assignment === null) {
      Toast.show({
        type: "error",
        text1: `You have not assigned to any bus, so can't start trip`,
        visibilityTime: 4000,
        autoHide: true,
      });
      return
    } else {
      Toast.show({
        type: "success",
        text1: `Trip started`,
        visibilityTime: 3000,
        autoHide: true,
      });
      startShering() // calling function start location shearing via webstokes
    }
    setLoading(true)

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied, Location permission is required.",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const bgStatus = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus.status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied, Background location is required.",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000, // 5 seconds
      distanceInterval: 0,
      foregroundService: {
        notificationTitle: "Trip Active",
        notificationBody: "Your location is being tracked",
      },
      showsBackgroundLocationIndicator: true,
    });

    setTripActive(true);
    setLoading(false)
  };

  // Stop Trip Handler
  const stopTrip = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    setTripActive(false);
    Toast.show({
      type: "success",
      text1: `Trip Ended, Location tracking stopped.`,
      visibilityTime: 3000,
      autoHide: true,
    });
    if (locationTimerRef.current) {
      clearInterval(locationTimerRef.current);
      locationTimerRef.current = null;
    }
    if (socketRef.current) {
      try { socketRef.current.disconnect(); } catch {}
      socketRef.current = null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <WelcomeSection />
        {/* Header */}
        <View>
          <Text className="text-xl font-bold mb-4">Welcome <Text className="text-blue-500">{`${driverData?.driver.fullname || 'name'}`}👋 to </Text>{driverData?.driver.role} dashboard</Text>
        </View>
        {/* Assignment Info */}
        <View className="bg-blue-100 rounded-2xl p-4 mb-5">
          <Text className="text-lg font-semibold">Assigned to: {driverData?.driver.fullname}</Text>
          <Text className="text-base">Email: {driverData?.driver.email || "Null"}</Text>
          <Text className="text-base mt-2">Phone number: {driverData?.driver.phone || "Null "}</Text>
          <Text className="text-base mt-2">Date of birth: {driverData?.driver.DateofBirth || "Null"}</Text>
          <Text className="text-base mt-2">Gender: {driverData?.driver.Gender}</Text>
        </View>

        {/* Bus Info */}
        <View className="bg-white border border-gray-200 rounded-2xl p-4 my-2">
          <Text className="text-lg font-semibold">Bus Info</Text>
          <Text className="text-base mt-1">
            date of assignment : {`${driverData?.assignment?.assigned_date || 'Not assigned'}`}
          </Text>
          <Text>
            Bus Number: {`${driverData?.assignment?.bus_number || 'Not assigned'}`}
          </Text>
          <Text className="text-base">
            Type: {`${driverData?.assignment?.bus_type || 'Not assigned'}`}
          </Text>
          <Text className="text-base">
            Capacity: {`${driverData?.assignment?.capacity || 'Not assigned'}`} seats
          </Text>
          <Text className="text-base">
            Deport code : {`${driverData?.assignment?.depo_code_number || 'Not assigned'}`}
          </Text>
          <Text className="text-base">
            Deport Name : {`${driverData?.assignment?.depo_name || 'Not assigned'}`}
          </Text>
          <Text className="text-base">
            Deport Location : {`${driverData?.assignment?.depo_location || 'Not assigned'}`}
          </Text>
          <Text className="text-base">
            status: {`${driverData?.assignment?.status || 'Not assigned'}`}
          </Text>
          <Text className="text-base">
            shift timings : {`${driverData?.assignment?.shift_time || 'Not assigned'}`}
          </Text>
        </View>

        {/* stops Info */}
        <View className="bg-white border border-gray-200 rounded-2xl p-4 my-4">
          <Text className="text-lg font-semibold mb-2">
            Route: {driverData?.assignment?.route_name}
          </Text>

          {driverData?.assignment?.stops?.map((stop, idx) => (
            <View key={idx} className="border-b border-gray-200 py-2">
              <Text className="font-medium">{stop.stop_name}</Text>
              <Text className="text-sm text-gray-600">
                Arrival: {stop.arrival_time} | Departure: {stop.departure_time}
              </Text>
            </View>
          ))}
        </View>

        {/* Trip Controls */}
        <View className="mb-10">
          {!tripActive ? (
            <Button title="Start Trip" onPress={startTrip} />
          ) : (
            <Button title="Stop Trip" color="red" onPress={stopTrip} />
          )}
        </View>
      </View>
      {Loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingAnime />
        </View>
      )}
    </ScrollView>
  );
}

// Define background task
// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   if (data) {
//     const { locations }: any = data;
//     const { latitude, longitude } = locations[0].coords;
//     console.log('lat:', latitude, 'lon:', longitude)
// Send to backend
// try {
//   await fetch("https://your-backend.com/api/location", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       driverId: 1, // Replace with real driver ID
//       latitude,
//       longitude,
//       timestamp: new Date().toISOString(),
//     }),
//   });
// } catch (err) {
//   console.error("Failed to send location:", err);
// }
//   }
// });
