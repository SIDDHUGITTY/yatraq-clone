import { Mail, Phone } from "lucide-react-native";
import { Linking, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const CONTACT = {
  other: {
    title: "For Other Queries",
    email: "info@yatraq.camelq.in",
    phones: ["+919553026345", "149"],
  },
};

export default function ContactUs({ navigation }: any) {
  const openEmail = (to: string) => Linking.openURL(`mailto:${to}`);
  const dial = (num: string) =>
    Linking.openURL(Platform.select({ ios: `telprompt:${num}`, android: `tel:${num}` })!);

  return (
    <SafeAreaView className="flex-1  bg-slate-50">
      <View className="m-4 p-4 bg-white rounded-xl shadow">
        <View className="h-px bg-gray-200 my-3" />
        {/* Other queries section */}
        <Text className="text-lg font-bold text-gray-800 text-center mb-3">
          {CONTACT.other.title}
        </Text>

        <View className="flex-row flex-wrap items-center mb-3">
          <Mail size={18} color="#6B7280" />
          <Text className="ml-2 mr-1 text-gray-600">E-Mail :</Text>
          <TouchableOpacity onPress={() => openEmail(CONTACT.other.email)}>
            <Text className="text-blue-600 underline">{CONTACT.other.email}</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap items-center">
          <Phone size={18} color="#6B7280" />
          <Text className="ml-2 mr-1 text-gray-600">Phone No :</Text>
          <TouchableOpacity onPress={() => dial(CONTACT.other.phones[0])}>
            <Text className="text-blue-600 underline">{CONTACT.other.phones[0]}</Text>
          </TouchableOpacity>
          <Text className="mx-1 text-gray-600">/</Text>
          <TouchableOpacity onPress={() => dial(CONTACT.other.phones[1])}>
            <Text className="text-blue-600 underline">{CONTACT.other.phones[1]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
