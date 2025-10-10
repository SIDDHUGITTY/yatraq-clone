import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useToast } from "react-native-toast-notifications";
import WelcomeSection from "../../components/WelcomeSection";

const Home = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const API_URL = Constants.expoConfig?.extra?.API_URL;
  // const translateX = useRef(new Animated.Value(-width)).current;
  const [page, setPage] = useState<number>(0);
  const pagerRef = useRef<PagerView>(null);
  const router = useRouter();
  const toast = useToast();

  //card slider images
  const images = [
    require("../../assets/images/findyourbuss.jpg"),
    require("../../assets/images/emergencycard.png"),
    require("../../assets/images/nearbystop.png"),
  ];

  //auto-scroll imgs every - logic
  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (page + 1) % images.length;
      setPage(nextPage);
      pagerRef.current?.setPage(nextPage);
    }, 1500);

    return () => clearInterval(interval);
  }, [page]);

  //toast notification on mount
  useEffect(() => {
    toast.show("Welcome passenger, Happy journey !", {
      type: "success",
      duration: 2500,
    });
  }, []);

  return (
    <ScrollView
      className="w-full px-5 bg-white"
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      <WelcomeSection />

      <Text className="text-2xl font-semibold my-3">Features</Text>

      <View className="flex-row flex-wrap justify-around">
        {/*Search By Number */}
        <TouchableOpacity
          className="border border-gray-200 rounded-3xl h-40 w-44 overflow-hidden mb-4"
          onPress={() => router.push("../SearchByNumber")}
        >
          <View className="flex-1 items-center justify-center bg-white">
            <Image
              source={require("../../assets/images/license_plate.png")}
              className="w-20 h-20"
            />
            <Text className="text-1xl font-semibold text-center bg-white">Search By Number</Text>
          </View>
        </TouchableOpacity>

        {/*Search By Route */}
        <TouchableOpacity
          className="border border-gray-200 rounded-3xl h-40 w-44 overflow-hidden mb-4"
          onPress={() => router.push("../SearchByRout")}
        >
          <View className="flex-1 items-center justify-center bg-white">
            <Image
              source={require("../../assets/images/route.png")}
              className="w-20 h-20"
            />
            <Text className="text-1xl font-semibold text-center bg-white">
              Search By Route
            </Text>
          </View>
        </TouchableOpacity>

        {/*Background Image Carousel */}
        <View className="rounded-3xl h-[35%] w-full my-4 overflow-hidden">
          <PagerView
            ref={pagerRef}
            style={{ flex: 1 }}
            initialPage={0}
            onPageSelected={(e) => setPage(e.nativeEvent.position)}
          >
            {images.map((img, index) => (
              <View key={index}>
                <Image
                  source={img}
                  resizeMode="cover"
                  className="w-full h-full"
                  style={{ borderRadius: 15 }}
                />
              </View>
            ))}
          </PagerView>

          {/*Dots Indicator */}
          <View className="absolute bottom-2 w-full flex-row justify-center gap-2">
            {images.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${page === index ? "bg-blue-600 w-4" : "bg-gray-300 w-2"
                  }`}
              />
            ))}
          </View>
        </View>

        {/*Nearby Bus Stops */}
        <TouchableOpacity
          className="border border-gray-200 rounded-3xl h-40 w-44 overflow-hidden mb-4"
          onPress={() => router.push("../GoogleMap")}
        >
          <View className="flex-1 items-center justify-center bg-white">
            <Image
              source={require("../../assets/images/nearby.png")}
              className="w-20 h-20"
            />
            <Text className="text-1xl font-semibold text-center bg-white">Nearby Bus Stops</Text>
          </View>
        </TouchableOpacity>

        {/*SOS */}
        <TouchableOpacity
          className="border border-gray-200 rounded-3xl h-40 w-44 overflow-hidden mb-4"
          onPress={() => router.push("../Sos")}
        >
          <View className="flex-1 items-center justify-center bg-white">
            <Image
              source={require("../../assets/images/sos.png")}
              className="w-20 h-20"
            />
            <Text className="text-1xl font-semibold text-center bg-white">SOS</Text>
          </View>
        </TouchableOpacity>

        {/*Emergency */}
        <TouchableOpacity
          className="border border-gray-200 rounded-3xl h-40 w-44 overflow-hidden mb-4"
          onPress={() => router.push("../emergency")}
        >
          <View className="flex-1 items-center justify-center bg-white">
            <Image
              source={require("../../assets/images/ambulance.png")}
              className="w-20 h-20"
            />
            <Text className="text-1xl font-semibold text-center bg-white">Emergency</Text>
          </View>
        </TouchableOpacity>

        {/*Contact Us */}
        <TouchableOpacity
          className="border border-gray-200 rounded-3xl h-40 w-44 overflow-hidden mb-4"
          onPress={() => router.push("../ContactUs")}
        >
          <View className="flex-1 items-center justify-center bg-white">
            <Image
              source={require("../../assets/images/help_desk.png")}
              className="w-20 h-20"
            />
            <Text className="text-1xl font-semibold text-center bg-white">Contact Us</Text>
          </View>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default Home;
