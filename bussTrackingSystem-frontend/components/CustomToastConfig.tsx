import { AlertTriangle, CheckCircle, XCircle } from "lucide-react-native";
import { Text, View } from "react-native";

export const toastConfig = {
  success: (props:any) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4ade80", // green
        padding: 12,
        marginTop: 50,
        marginHorizontal: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
      }}
    >
      <CheckCircle color="white" size={22} />
      <Text style={{ color: "white", marginLeft: 10, fontWeight: "600" }}>
        {props.text1}
      </Text>
    </View>
  ),

  error: (props:any) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ef4444", // red
        padding: 12,
        marginTop: 50,
        marginHorizontal: 20,
        borderRadius: 12,
      }}
    >
      <XCircle color="white" size={22} />
      <Text style={{ color: "white", marginLeft: 10, fontWeight: "600" }}>
        {props.text1}
      </Text>
    </View>
  ),

  warning: (props:any) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f59e0b", // yellow
        padding: 12,
        marginTop: 50,
        marginHorizontal: 20,
        borderRadius: 12,
      }}
    >
      <AlertTriangle color="white" size={22} />
      <Text style={{ color: "white", marginLeft: 10, fontWeight: "600" }}>
        {props.text1}
      </Text>
    </View>
  ),
};
//we already using tostfy direactly massanger so don't need to use this one