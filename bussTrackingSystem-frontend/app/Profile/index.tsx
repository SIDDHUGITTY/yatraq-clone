import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Location from "expo-location";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { Calendar, Mail, MapPin, Phone, UserCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';
import LoadingAnime from '../../components/LoadingAnime';

const ProfileScreen = () => {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const [location, setLocation] = useState<string>("Fetching location...");
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [Loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('access_token');
      console.log(storedToken, 'this is profile token')
      if (storedToken) {
        // decode token
        const decoded = jwtDecode(storedToken);
        setUser(decoded);
        // clg
        console.log("Decoded JWT:", user[0]);
      }
    };
    // Fetch live location
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
        setLocation(
          `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.postalCode || ''}`
        );
      } else {
        setLocation(`Lat: ${loc.coords.latitude}, Lng: ${loc.coords.longitude}`);
      }
    })();
    fetchToken();
  }, []);

  const LogOutHandler = async () => {
    console.log('pressd logout')
    setLoading(true)
    try {
      await AsyncStorage.removeItem('access_token'); // clear token
      router.replace('/Login'); // navigate to login screen
    } catch (error) {
      console.log("Error clearing async storage:", error);
      Toast.show({
        type: "error",
        text1: "Getting error in logout!",
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setLoading(false)
    }
  }
// console.log(user?.profile,'from profile ')
  // const createProfile = async () => {
  //   try {
  //     const response = await axios.post(`${API_URL}/auth/create`, {
  //       phone: Phone,
  //     });
  //     console.log("✅ Profile Created:", response.data);
  //     const { access_token, user } = response.data;
  //     setUser(user);
  //     setToken(access_token);
  //     console.log(user)
  //     return response.data;
  //   } catch (err: any) {
  //     Toast.show({
  //       type: "error",
  //       text1: `❌ Error fetching profile:", ${err.response?.data || err.message}`,
  //       visibilityTime: 3000,
  //       autoHide: true,
  //     });
  //   }
  // };
  // useEffect(() => {
  //   createProfile(); // Call API when component mounts
  // }, []);
  return (
    <>
      <ScrollView className="flex-1 bg-white">
        <View className="bg-100  rounded-xl mx-4 mt-5 p-4 gap-3">
          <View className="flex-1 flex-row items-center border-gray-500 rounded-3xl bg-white py-4 px-4 my-2 shadow-md">
            {user?.profile ? (
              <Image
                source={{ uri: user?.profile,}}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <Image
                source={require('../../assets/images/user.png')}
                className="w-24 h-24 rounded-full"
              />
            )}
            <View className="ml-4 flex-1 ">
              <Text className="text-lg font-semibold">{user?.name || 'Name'}</Text>
              {/* <Text className="text-sm text-gray-500">Last Login: {form.lastLogin}</Text> */}
            </View>
          </View>

          {/* Phone */}
          <View className="flex-row items-center mb-3 self-start border-0 border-gray-500 rounded-xl  py-4 px-4 w-full bg-white shadow-md">
            <Phone color="black" size={20} />
            <Text className="ml-2 text-gray-500">{user?.phone || '00000000000'}</Text>
          </View>

          {/* Email */}
          <View className="flex-row items-center mb-3 self-start border-0 border-gray-500 rounded-xl  py-4 px-4 w-full bg-white shadow-md">
            <Mail color="black" size={20} />
            <Text className="ml-2 text-gray-500">{user?.email || 'mail@gmail.com'}</Text>
          </View>

          {/* Address */}
          <View className="flex-row items-center mb-3 self-start border-0 border-gray-500 rounded-xl  py-4 px-4 w-full bg-white shadow-md">
            <MapPin color="black" size={20} />
            <Text className="ml-2 text-gray-500">{location}</Text>
          </View>

          {/* DOB */}
          <View className="flex-row items-center mb-3 self-start border-0 border-gray-500 rounded-xl  py-4 px-4 w-full bg-white shadow-md">
            <Calendar color="black" size={20} />
            <Text className="ml-2 text-gray-500">{user?.dateOfBirth || '2000-01-01'}</Text>
          </View>

          {/* Gender */}
          <View className="flex-row items-center self-start border-0 border-gray-500 rounded-xl  py-4 px-4 w-full bg-white shadow-md">
            <UserCircle color="black" size={20} />
            <Text className="ml-2 text-gray-500">{user?.gender || "Can't say"}</Text>
          </View>

          {/* Update Button */}
          <View className="flex-1 flex-row justify-around gap-4">
            <TouchableOpacity className="bg-blue-500 rounded-xl py-3 px-6 mt-6 justify-center w-[60%]" onPress={() => router.replace('/Profile/Update')}>
              <Text className="text-white text-center text-lg font-semibold">
                Update Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-500 rounded-xl py-3 px-6 mt-6 justify-center w-[30%]" onPress={LogOutHandler}>
              <Text className="text-white text-center text-lg font-semibold">
                log out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
    
    </>
  );
}

export default ProfileScreen;
