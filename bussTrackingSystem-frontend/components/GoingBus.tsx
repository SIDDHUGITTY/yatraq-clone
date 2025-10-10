import LottieView from "lottie-react-native";
import { View } from "react-native";

export default function WelcomeSection() {
  return (
    <View className="w-[100%]">
      <View className="items-center">
        <LottieView
          source={require("../assets/animations/GoingBus.json")}
          autoPlay
          loop
          style={{ width: 500, height: 350 }}
          speed={1}
        />
      </View>
    </View>
  );
}
