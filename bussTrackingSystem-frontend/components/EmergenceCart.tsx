import { useRouter } from "expo-router";
import { Hand } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function EmergencyCard() {
  const router = useRouter();
  
  //this will replace route when pressed
  const handleSOS = () => {
    router.replace('/Sos'); 
  };

  return (
    <View className="bg-red-100 rounded-lg p-4 flex-row justify-between items-center shadow-md border-b-4 border-red-400 h-[20%]">
      <View className="flex-1 pr-4">
        <Text className="text-lg font-bold text-black">Are you in Emergency?</Text>
        <Text className="text-base text-gray-700 mt-1">
          Press <Text className="text-red-600 font-semibold">SOS</Text> button and help will reach you soon
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSOS}
        className="bg-red-600 px-6 py-3 rounded-lg flex-row items-center justify-center border-b-4 border-red-800"
      >
        <Text className="text-white font-semibold text-lg">SOS</Text>
        <Hand size={20} color="white" className="ml-2" />
      </TouchableOpacity>
    </View>
  );
}
