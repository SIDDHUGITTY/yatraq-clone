import { Image, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';

const SearchHeader = () => {
  const handleSearch = () => {
    console.log("Searching...");
    // You can trigger API or search logic here
  };

  return (
    <SafeAreaView className="bg-transparent">
      <View className="px-4 py-2">
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
          {/* Input Field */}
          <TextInput
            placeholder="Search Google or type a URL"
            placeholderTextColor="#999"
            className="flex-1 text-base text-black"
          />

          {/* Search Icon Button */}
          <Pressable onPress={handleSearch} className="mr-2">
            <Text className="text-xl">🔍</Text>
          </Pressable>

          {/* Profile Pic */}
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            className="w-8 h-8 rounded-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchHeader;
//currently im not using this component