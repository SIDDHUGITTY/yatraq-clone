import LottieView from "lottie-react-native";
import { View } from 'react-native';

const Loading = () => {
  return (
    <View className="items-center justify-center bg-transparent">
      <LottieView
        source={require("../assets/animations/TireRotation.json")}
        autoPlay
        loop
        style={{ width: 400, height: 250 }}
        speed={1}
      />
    </View>
  )
}

export default Loading 