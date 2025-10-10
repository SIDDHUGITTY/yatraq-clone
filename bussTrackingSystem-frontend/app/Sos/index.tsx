import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Contacts from "expo-contacts";
import { Ambulance, Heart, Phone, Plus, Shield, Users, X } from "lucide-react-native"; // for nice icons
import { useEffect, useState } from "react";
import { FlatList, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";


const EmergencySOS = () => {
  const [userContacts, setUserContacts] = useState<{ name: string; number: string }[]>([]);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [availableContacts, setAvailableContacts] = useState<Contacts.Contact[]>([]);
  
  //emergency numbers list
  const emergencyNumbers = [
    { label: "All-in-one Helpline", number: "112", icon: "phone" },
    { label: "Police", number: "100", icon: "shield" },
    { label: "Ambulance", number: "108", icon: "ambulance" },
  ];

  //saved contacts get from the local storage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("emergencyContacts");
      if (saved) {
        setUserContacts(JSON.parse(saved));
      }
    })();
  }, []);

  //opne dialler 
  const callNumber = (number: string) => {
    Linking.openURL(`tel://${number}`).catch(() => {
      Toast.show({
        type: "error",
        text1: "Oops!, Could not open the dialer",
        visibilityTime: 3000,
        autoHide: true,
      });
    });
  };

  const renderIcon = (iconType: string, size: number = 24, color: string = "white") => {
    switch (iconType) {
      case "phone":
        return <Phone size={size} color={color} />;
      case "shield":
        return <Shield size={size} color={color} />;
      case "ambulance":
        return <Ambulance size={size} color={color} />;
      default:
        return <Phone size={size} color={color} />;
    }
  };

  //show contacts in a model
  const showContactPickerModal = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission denied, We need access to show your contacts",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
    });

    // Filter contacts that have phone numbers
    const contactsWithNumbers = data.filter(contact =>
      contact.phoneNumbers && contact.phoneNumbers.length > 0
    );

    setAvailableContacts(contactsWithNumbers);
    setShowContactPicker(true);
  };

  const addContactToFavorites = async (contact: Contacts.Contact) => {
    const newContact = {
      name: contact.name || "Unknown",
      number: contact.phoneNumbers?.[0]?.number ?? "",
    };

    // Check if contact already exists
    const exists = userContacts.some(c => c.number === newContact.number);
    if (exists) {
      Toast.show({
        type: "error",
        text1: "Already Added, This contact is already in your favorites",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const updated = [...userContacts, newContact];
    setUserContacts(updated);
    await AsyncStorage.setItem("emergencyContacts", JSON.stringify(updated));
    setShowContactPicker(false);
    Toast.show({
      type: "success",
      text1: `Added!, ${newContact.name} saved as emergency contact`,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const removeContact = async (index: number) => {
    const updated = userContacts.filter((_, i) => i !== index);
    setUserContacts(updated);
    await AsyncStorage.setItem("emergencyContacts", JSON.stringify(updated));

    //this toast added but not chicked 🚫
    Toast.show({
      type: "success",
      text1: "contact removed",
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-gray-800 text-3xl font-bold text-center mb-6">Emergency SOS</Text>

        {/* Emergency Numbers */}
        <View className="space-y-4">
          {emergencyNumbers.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => callNumber(item.number)}
              className="bg-[#f52f2f] py-4 px-6 mb-2 rounded-xl flex-row items-center justify-between shadow-md"
            >
              <View className="flex-row items-center">
                <View className="mr-3">
                  {renderIcon(item.icon, 28, "white")}
                </View>
                <Text className="text-white font-bold text-lg">{item.label}</Text>
              </View>
              <Text className="text-white font-semibold text-lg">{item.number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Favorite Contacts */}
        <View className="mt-8">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Heart size={28} color="#ef4444" className="mr-2" />
              <Text className="text-2xl font-bold text-gray-800 ml-2">Favorite Contacts</Text>
            </View>
            <TouchableOpacity
              onPress={showContactPickerModal}
              className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
            >
              <Plus size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {userContacts.length === 0 ? (
            <View className="bg-gray-200 p-6 mt-10 rounded-xl items-center">
              <View className="my-5">
                <Users size={70} color="#555" />
              </View>
              <Text className="text-gray-600 mt-10 text-3xl">No favorite contacts yet</Text>
              <Text className="text-gray-500 text-sm my-5 text-center">
                Add someone from your phonebook so you can call them quickly in an emergency.
              </Text>
            </View>
          ) : (
            userContacts.map((contact, idx) => (
              <View
                key={idx}
                className="bg-white p-4 rounded-xl shadow-sm mb-3 flex-row justify-between items-center"
              >
                <TouchableOpacity
                  onPress={() => callNumber(contact.number)}
                  className="flex-1 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center">
                    <View className="bg-blue-100 p-2 rounded-full mr-3">
                      <Phone size={16} color="#1e40af" />
                    </View>
                    <Text className="text-gray-800 font-medium text-lg">{contact.name}</Text>
                  </View>
                  <Text className="text-blue-600 font-semibold">{contact.number}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeContact(idx)}
                  className="ml-3 p-2 bg-red-50 rounded-full"
                >
                  <X size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Contact Picker Modal */}
      <Modal
        visible={showContactPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <Users size={24} color="#1e40af" />
              <Text className="text-xl font-bold text-gray-800 ml-2">Select Contact</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowContactPicker(false)}
              className="p-2 bg-gray-100 rounded-full"
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Contacts List */}
          <FlatList
            data={availableContacts}
            keyExtractor={(item, index) => item.name || index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => addContactToFavorites(item)}
                className="p-4 border-b border-gray-100 flex-row justify-between items-center"
              >
                <View className="flex-1">
                  <Text className="text-lg font-medium text-gray-800">
                    {item.name || "Unknown"}
                  </Text>
                  {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                    <Text className="text-gray-600 mt-1">
                      {item.phoneNumbers[0].number}
                    </Text>
                  )}
                </View>
                <Text className="text-blue-500 font-medium">Add</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center p-8">
                <Users size={60} color="#ccc" />
                <Text className="text-gray-500 text-lg mt-4">No contacts found</Text>
                <Text className="text-gray-400 text-center mt-2">
                  Make sure you have contacts with phone numbers in your device
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

export default EmergencySOS;
