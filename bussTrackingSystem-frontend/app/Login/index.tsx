import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Image, ImageBackground, Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import GoingBuss from '../../assets/animations/BusGoing.json';
import LoadingAnime from '../../components/LoadingAnime';

export default function LoginScreen() {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const router = useRouter();
  const [Phone, setPhone] = useState('');
  const [Loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // form validation -- like phone number
  const validateForm = () => {
    const isPhone = /^[0-9]{10}$/.test(Phone);
    if (!Phone) {
      Toast.show({
        type: "error",
        text1: "Invalid Number, Enter a valid 10-digit phone number 🚫",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }
    if (!isPhone) {
      Toast.show({
        type: "error",
        text1: "Enter a valid 10-digit phone number 🚫",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }
    return true;
  };

  //login logic here -- like sending otp 
  const handleLogin = async () => {
    setLoading(true);
    if (!validateForm()) return setLoading(false);
    
    try {
      const response = await axios.post(`${API_URL}/auth/create`, { phone: Phone });
      const { access_token } = response.data;
      await AsyncStorage.setItem('access_token', access_token); // Store token
      setToken(access_token);
      setLoading(false);
      setTimeout(() => {
        router.push({
          pathname: '/Login/OTP',
          params: { phone: Phone, tocken: access_token },
        });
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.log("❌ Error creating profile:", err.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: err.message,
        visibilityTime: 3000,
        autoHide: true,
      });
    }finally{
      setLoading(false);
      return
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraScrollHeight={5}
      >
        <View className="flex-1 justify-center items-center px-5 bg-white">
          <ImageBackground
            source={require("../../assets/images/banner.png")}
            resizeMode="cover"
            className="flex-1 justify-center items-center w-screen"
          >
          </ImageBackground>
          <View className="px-6 flex-1 flex-col justify-between overflow-hidden">
            <View>
              <View className="flex flex-row items-center my-2">
                <Text className="text-5xl font-bold text-gray-500">Yatra</Text>
                <Image source={require('../../assets/images/btslogo.png')} className="w-10 h-10" />
                <LottieView
                  source={GoingBuss}
                  autoPlay
                  loop
                  style={{ width: 100, height: 60 }}
                />
              </View>
              <Text className="text-3xl my-5 font-bold text-gray-600">Verify your phone number</Text>
              <Text className="text-md font-bold text-gray-500 my-2">
                New account or Already have a yatraQ account? start with your mobile number
              </Text>

              {/* Phone Input */}
              <Text className="text-[#1E40AF] font-bold mt-1">Enter mobile number</Text>
              <View className="flex-row items-center px-3 py-2 border-b-2 border-gray-300 rounded-3xl mt-2">
                <Feather name="phone" size={20} color="#1E40AF" />
                <TextInput
                  className="ml-3 flex-1 text-base text-[#1E40AF]"
                  placeholder="Phone Number"
                  value={Phone}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\D/g, '');
                    const isValid =
                      cleaned === '' ||
                      (/^[6-9]/.test(cleaned) &&
                        !/(\d)\1{5,}/.test(cleaned) &&
                        cleaned.length <= 10);

                    if (isValid) {
                      setPhone(cleaned);
                    }
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  autoCapitalize="none"
                  placeholderTextColor="gray"
                />
              </View>
            </View>
            <View>
              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                className="bg-[#1E40AF] py-3 my-3 rounded-3xl"
              >
                <Text className="text-white text-center font-semibold text-lg">Verify</Text>
              </Pressable>

            </View>
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
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
