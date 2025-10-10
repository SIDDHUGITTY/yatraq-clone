import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import EmergencyCard from '../../components/EmergenceCart';
import LoadingAnime from '../../components/LoadingAnime';

const ReportBreakdownForm = () => {
    const API_URL = Constants.expoConfig?.extra?.API_URL;
  const [busNumber, setBusNumber] = useState('');
  const [userNumber, setUserNumber] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  
  //location permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
        type: "error",
        text1: "Permission denied, Location access is required.",
        visibilityTime: 3000,
        autoHide: true,
      });
        return;
      }
      
      const loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude.toString());
      setLongitude(loc.coords.longitude.toString());
      setLocation(`https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!busNumber || !userNumber ) {
      Toast.show({
        type: "error",
        text1: 'Fill in all required fields',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }
    if (!latitude || !longitude) {
      Toast.show({
        type: "error",
        text1: "Location not available, Enable GPS and try again.",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/report-breakdown/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude,
          longitude,
          bus_number: busNumber,
          phone: userNumber,
          description: description,
        }),
      });

      const data = await res.json();
      console.log("🚍 Breakdown Response:", data);
Toast.show({
        type: "error",
        text1: "Reported!, Bus breakdown has been reported successfully.",
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch (err) {
      console.error("❌ Error reporting breakdown:", err);
      Toast.show({
        type: "error",
        text1: "Error, Could not send breakdown report. Try again.",
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
    }
    setBusNumber('');
    setUserNumber('')
    setDescription('')
    setLocation('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <View className="flex-1 justify-center py-5 px-8 bg-white">
      
      <EmergencyCard />
      
      <View className="flex-1 px-6 py-5">
        <Text className="text-2xl font-bold text-gray-800 mt-10 mb-6">Report Breakdown</Text>

        <TextInput
          placeholder="Bus Number"
          value={busNumber}
          onChangeText={setBusNumber}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />
        <TextInput
          placeholder="Enter Your Number"
          value={userNumber}
          onChangeText={setUserNumber}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />

        <TextInput
          placeholder="Describe the issue"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-md p-3 mb-4 h-24"
        />

        <TouchableOpacity
          className="bg-yellow-500 rounded-md py-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">Submit Report</Text>
        </TouchableOpacity>

        {location && (
          <Text className="text-xs text-gray-500 mt-4">
            📍 Location: {location}
          </Text>
        )}
      </View>
      
      {loading && (
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
    
    </View>
  );

}
export default ReportBreakdownForm;
