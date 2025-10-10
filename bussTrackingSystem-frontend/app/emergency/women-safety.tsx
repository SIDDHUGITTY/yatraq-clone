import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import EmergencyCard from '../../components/EmergenceCart';
import LoadingAnime from '../../components/LoadingAnime';

const WomenSafetyForm = () => {
  const [name, setName] = useState('');
  const [issue, setIssue] = useState('');
  const [busNumber, setBusNumber] = useState('')
  const [userNumber, setUserNumber] = useState('')
  const [description, setDescription] = useState('');
  const [Loading, setLoading] = useState(false)
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied to access location');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude.toString());
      setLongitude(loc.coords.longitude.toString());
      const coords = loc.coords;
      setLocation(`https://maps.google.com/?q=${coords.latitude},${coords.longitude}`);
    })();
  }, []);


  const handleSubmit = async () => {
    console.log(location, 'this is from locaation background..')
    if (!name || !issue || !busNumber || !userNumber) {
      Alert.alert('Please fill required fields');
      return;
    }
    if (!latitude || !longitude) {
      Alert.alert('Location not available', 'Please enable GPS and try again.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://10.73.213.97:3000/woman-safety/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          issues: issue,
          latitude: latitude,
          longitude: longitude,
          bus_number: busNumber,
          phone: userNumber,
          description: description
        }),
      });

      const data = await res.json();
      console.log("🚨 SOS Response:", data);
      Alert.alert('Submitted!', 'Your emergency report has been sent.');

    } catch (err) {
      console.error("❌ Error sending SOS request:", err);
    } finally {
      setLoading(false);
    }

    setName('')
    setIssue('')
    setBusNumber('')
    setUserNumber('')
    setDescription('')
    setLocation('')
  };

  return (
    <View className="flex-1 justify-center px-5 py-5 bg-white">
      <EmergencyCard />
      <View className="flex-1 py-5">
        <Text className="text-2xl font-bold text-black mt-10 mb-6">Women Safety Report</Text>

        <TextInput
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />

        <TextInput
          placeholder="Issue Type (e.g. harassment)"
          value={issue}
          onChangeText={setIssue}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />
        <TextInput
          placeholder="Bus Number (e.g. TS09Z1011)"
          value={busNumber}
          onChangeText={setBusNumber}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />
        <TextInput
          placeholder="Enter Your Phone Number(e.g. +91 99******09)"
          value={userNumber}
          onChangeText={setUserNumber}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />

        <TextInput
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-md p-3 mb-4 h-24"
        />

        <TouchableOpacity
          className="bg-red-600 rounded-md py-4"
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

export default WomenSafetyForm;
