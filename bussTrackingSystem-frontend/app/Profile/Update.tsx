import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { jwtDecode } from 'jwt-decode';
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import LoadingAnime from '../../components/LoadingAnime';

const Update = () => {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState('')
  const [dob, setDob] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [avatar, setAvatar] = useState('https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg')
  const [gender, setGender] = useState<"male" | "female" | "notToSay" | null>(null);
  const [Loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<RNFile | null>(null);

  type RNFile = {
    uri: string;
    type: string;
    name: string;
  };

  //decode token and fetching role form it 
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('access_token');
      // console.log(storedToken, 'this is profile token')
      if (storedToken) {
        const decoded = jwtDecode(storedToken);
        setUser(decoded);
      }
    };
    fetchToken();
  }, []);

  //changing dob to normal fom
  const formatDOB = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  };
  //img pic select
  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Denied!");
      return 
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setAvatar(asset.uri); // preview in <Image />

      // store for upload
      setSelectedFile({
        uri: result.assets[0].uri,
        type: result.assets[0].type ?? "image/jpeg",
        name: result.assets[0].fileName ?? "profile.jpg",
      });

    }
  };

  //otp to mail for verify 
  const handleVerifyOtp = async () => {
    // name validation
    if (!name.trim() || name.length < 3) {
      Toast.show({
        type: "error",
        text1: "Enter a valid name (min 3 chars) 🚫",
        visibilityTime: 2500,
      });
      return;
    }
    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Enter a valid email 📧",
        visibilityTime: 2500,
      });
      return;
    }

    // gender validation
    if (!gender) {
      Toast.show({
        type: "error",
        text1: "Please select a gender 🚻",
        visibilityTime: 2500,
      });
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", name);
      formData.append("email", email);
      formData.append("DateofBirth", formatDOB(dob));
      formData.append("Gender", gender === "male" ? "Male" : gender === "female" ? "Female" : "Prefer not to say");

      if (selectedFile) {
        formData.append("profile_url", {
          uri: selectedFile.uri,
          type: "image/jpeg", // ✅ force correct type
          name: selectedFile.name || "profile.jpg",
        } as any);
      }

      const res = await axios.patch(
        `${API_URL}/profile/send-otp?phone=${user.phone}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data, 'this is from res')
      Toast.show({
        type: "success",
        text1: "OTP sent successfully 🎉",
        visibilityTime: 2000,
      });
    } catch (err: any) {
      console.log("❌ Error:", err.message);
      Toast.show({
        type: "error",
        text1: `❌Error:${err.message}`,
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  //submit btn
  const submitHandler = async () => {

    // otp validation
    if (!otp.trim() || otp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Enter a valid 6 digit OTP 🔑",
        visibilityTime: 2500,
      });
      return;
    }

    // dob validation
    if (dob > new Date()) {
      Toast.show({
        type: "error",
        text1: "Date of birth cannot be in the future 📅",
        visibilityTime: 2500,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(`${API_URL}/profile/verify-otp?phone=${user.phone}`, {
        email: email,
        userOtp: otp,
        Gender: gender
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      }
      );
      Toast.show({
        type: "success",
        text1: "Profile updated successfully 🎉",
        visibilityTime: 2000,
      });
      setLoading(false);
    } catch (err: any) {
      console.error("❌ Error verifying OTP:", err);
      let errorMsg = "Something went wrong!";
      if (err.response?.data) {
        errorMsg = err.response.data.message || JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMsg = err.message;
      }
      Toast.show({
        type: "error",
        text1: errorMsg,
        visibilityTime: 2000,
      });
      setLoading(false);
    }
    console.log(gender, 'gender form update')
    setName("");
    setEmail("");
    setOtp("");
    setDob(new Date());
    setGender(null);
  }

  return (
    <View className="flex-1 bg-white p-4 gap-5">
      <Text className="text-3xl font-bold mb-4">Profile</Text>
      <View className="w-full items-center relative">
        <Image
          source={{ uri: avatar }}
          className="w-44 h-44 rounded-full border-2 border-gray-300"
        />

        <TouchableOpacity
          onPress={pickImage}
          className="absolute bottom-[-15] right-50 bg-white rounded-full p-2 shadow-md"
        >
          <Camera size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <TextInput
        className="flex-row items-center mb-3 self-start border-0 border-gray-500 rounded-xl  py-4 px-4 w-full bg-white shadow-md"
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className="flex-row items-center mb-3 self-start border-0 border-gray-500 rounded-xl  py-4 px-4 w-full bg-white shadow-md"
      >
        <Text className="text-gray-700">
          Date of birth : {dob.toDateString()}
        </Text>
      </TouchableOpacity>
      <View className="flex-row justify-around mb-5 gap-3">
        <TouchableOpacity
          onPress={() => setGender("male")}
          className={`px-5 py-2 rounded-xl border border-gray-100 ${gender === "male" ? "bg-blue-500" : "bg-white"
            }`}
        >
          <Text
            className={`${gender === "male" ? "text-white" : "text-blue-500"
              } font-semibold`}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setGender("female")}
          className={`px-5 py-2 rounded-xl border border-gray-100 ${gender === "female" ? "bg-blue-500" : "bg-white"
            }`}
        >
          <Text
            className={`${gender === "female" ? "text-white" : "text-blue-500"
              } font-semibold`}
          >
            Female
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGender("notToSay")}
          className={`px-5 py-2 rounded-xl border border-gray-100 ${gender === "notToSay" ? "bg-blue-500" : "bg-white"
            }`}
        >
          <Text
            className={`${gender === "notToSay" ? "text-white" : "text-blue-500"
              } font-semibold`}
          >
            Prefer not to say
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center justify-between w-full gap-3 mb-3">
        <TextInput
          className="flex-1 border-0 border-gray-500 rounded-xl py-4 px-4 bg-white shadow-md"
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity className="bg-blue-500 px-4 py-4 rounded-xl" onPress={handleVerifyOtp}>
          <Text className="text-white font-bold">Send OTP</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        className="flex-row items-center mb-3 self-start border-0 border-gray-500 rounded-xl w-full py-4 px-4 bg-white shadow-md"
        placeholder="Enter 6 digits OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />

      {showPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}



      <TouchableOpacity className="bg-blue-600 rounded-xl py-3" onPress={submitHandler}>
        <Text className="text-white text-center text-lg font-semibold">
          Save Profile
        </Text>
      </TouchableOpacity>
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
}
export default Update;
