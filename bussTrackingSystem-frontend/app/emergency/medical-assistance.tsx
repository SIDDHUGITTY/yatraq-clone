import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import EmergencyCard from '../../components/EmergenceCart';
import LoadingAnime from '../../components/LoadingAnime';

const MedicalAssistanceForm = () => {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const [name, setName] = useState('');
  const [condition, setCondition] = useState('');
  const [userNumber, setUserNumber] = useState('')
  const [busNumber, setBusNumber] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState("");
  const [Loading, setLoading] = useState(false)
  const [longitude, setLongitude] = useState("");

  //current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: "error",
          text1: 'Location permission denied',
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(`https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`);
      setLatitude(loc.coords.latitude.toString())
      setLongitude(loc.coords.longitude.toString())
    })();
  }, []);

  const handleSubmit = async () => {
    if (!name || !condition || !busNumber || !userNumber) {
      Toast.show({
        type: "error",
        text1: 'Please fill all details',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/medical-assistances/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          condition,
          latitude: latitude,
          longitude: longitude,
          bus_number: busNumber,
          issues: condition,
          phone: userNumber,
          description,
        }),
      });

      const data = await res.json();
      console.log("🚑 Medical Assistance Response:", data);

      if (res.ok) {
        Toast.show({
          type: "success",
          text1: "Success, Medical assistance reported successfully!",
          visibilityTime: 3000,
          autoHide: true,
        });
      } else {
        Toast.show({
          type: "error",
          text1: `${data?.message}, Something went wrong`,
          visibilityTime: 3000,
          autoHide: true,
        });
      }

    } catch (err) {
      console.error("❌ Error:", err);
      Toast.show({
        type: "error",
        text1: `${err}, Could not send request. Try again later.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
    }
    setName('');
    setCondition('');
    setUserNumber('')
    setBusNumber('')
    setDescription('')
    setLatitude('');
    setLongitude('');
  };

  return (
    <View className="flex-1 justify-center py-5 px-5">
      <EmergencyCard />

      <View className="flex-1 px-6 py-5">
        <Text className="text-2xl font-bold text-gray-800 mt-10 mb-6">Medical Assistance</Text>

        <TextInput
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />
        <TextInput
          placeholder="Your Number"
          value={userNumber}
          onChangeText={setUserNumber}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />
        <TextInput
          placeholder="Bus Number"
          value={busNumber}
          onChangeText={setBusNumber}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />
        <TextInput
          placeholder="Issue"
          value={condition}
          onChangeText={setCondition}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />

        <TextInput
          placeholder="Description "
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          className="border border-gray-300 rounded-md p-3 mb-4 h-20"
        />

        <TouchableOpacity
          className="bg-green-600 rounded-md py-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">Request Help</Text>
        </TouchableOpacity>

        {location && (
          <Text className="text-xs text-gray-500 mt-4">
            📍 Location: {location}
          </Text>
        )}
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
    
    </View>
  );
};

export default MedicalAssistanceForm;
