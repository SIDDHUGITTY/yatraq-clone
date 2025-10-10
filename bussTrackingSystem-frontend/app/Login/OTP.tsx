import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { ImageBackground, Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from "react-native-toast-message";
import { useToast } from 'react-native-toast-notifications';
import verifyphone1 from '../../assets/animations/VerifyPhone1.json';
import LoadingAnime from '../../components/LoadingAnime';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtpScreen() {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const toast = useToast();
  const router = useRouter();
  const { setRole } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [roles, setRoles] = useState('passanger')
  const [Loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null);


  const inputs = useRef<Array<TextInput | null>>([]);
  //tost notifications  
  useEffect(() => {
    toast.show('Your phone number verifyd and sent you a OTP!', {
      type: 'success',
      duration: 2000,
    });
  }, []);

  // Countdown logic
  useEffect(() => {
    if (resendDisabled && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer, resendDisabled]);

  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      setTimeout(() => inputs.current[index + 1]?.focus(), 100);
    }
    if (!text && index > 0) {
      setTimeout(() => inputs.current[index - 1]?.focus(), 100);
    }
  };

  // decode JWT when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("access_token");
      if (storedToken) {
        const decoded: any = jwtDecode(storedToken);
        setUser(decoded);
        console.log("Decoded JWT:", decoded);
      }
    };
    fetchToken();
  }, []);

  const verifyOtp = () => {
    setLoading(true);
    const otpValue = otp.join("");

    setTimeout(() => {
      setLoading(false);

      if (otpValue === "111111") {
        if (user?.role === "PASSENGER") {
          router.replace("/HomeScreen" as any);
        } else if (user?.role === "DRIVER" || user?.role === "CONDUCTOR") {
          router.replace("/DriverHomeScreen" as any);
        } else {
          Toast.show({
            type: "error",
            text1: "Invalid role 🚫",
            visibilityTime: 2500,
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid OTP 🚫",
          visibilityTime: 2500,
        });
      }
    }, 1500);
  };

  const handleResend = () => {
    if (resendDisabled) return;
    // Reset countdown
    setTimer(30);
    setResendDisabled(true);

    // try {
    //   await fetch('http://localhost:3000/user/register/send-otp', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ phone }),
    //   });

    //   Alert.alert('OTP Resent 📩', 'Check your phone again');
    // } catch (err) {
    //   Alert.alert('Error ❌', 'Failed to resend OTP');
    // }

    // Mock resend:
    Toast.show({
      type: "error",
      text1: `Mock Resent ✅ OTP resent to ${phone}`,
      visibilityTime: 2500,
      autoHide: true,
    });
  };

  const getMaskedPhone = () => {
    const str = phone?.toString() || '';
    return '9*******' + str.slice(-3);
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
        <View className='flex-1 flex-col justify-center bg-white'>
          <ImageBackground
            source={require("../../assets/images/banner.png")}
            resizeMode="cover"
            className="flex-1 w-screen"
          >
          </ImageBackground>
          <View className="px-6 flex-1 flex-col justify-between overflow-hidden">
            <View>
              <View className='flex-1 flex-row items-center my-3'>
                <Text className="text-4xl font-bold text-gray-500"> Verify OTP</Text>
                <LottieView
                  source={verifyphone1}
                  autoPlay
                  loop
                  style={{ width: 100, height: 60 }}
                />
              </View>
              <Text className=" text-gray-600 mb-6">
                Enter the OTP ( One time password ) from the sms we sent to : {'\n'}<Text className="font-bold">+91 {getMaskedPhone()}</Text>
              </Text>
              <View className="flex-row justify-between mx-3 mb-6">
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => { inputs.current[index] = el; }}
                    className="w-12 h-12 text-xl text-black text-center border border-[#1E40AF] rounded-lg"
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                  />
                ))}
              </View>
            </View>
            <View>
              <Pressable onPress={verifyOtp} className="bg-[#1E40AF] py-3 rounded-3xl">
                <Text className="text-white text-center text-lg font-semibold">Verify</Text>
              </Pressable>
              <View className="my-2.5 flex-row justify-center">
                {resendDisabled ? (
                  <Text className="text-gray-500">Resend OTP in {timer}s</Text>
                ) : (
                  <Pressable onPress={handleResend}>
                    <Text className="text-[#1E40AF] font-semibold underline">Resend OTP</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View >
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
