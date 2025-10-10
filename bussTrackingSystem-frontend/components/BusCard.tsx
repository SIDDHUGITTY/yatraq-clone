import { AlertTriangle, Bus, Clock, Star } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

type Basic = {
    driverName: string;
    conductor: string;
    busType: string;
    routeName: string;
    busStatus: string;
};
type More = {
    currentLocation: string;
    nextStop: string;
    lastUpdated: string;
    etaToNextStop: string;
    startTime: string;
    endTime: string;
    totalStops: string[];
    currentStop: string;
    driverContact: string;
    busFrequency: string;
    passengerCountStatus: string;
    alerts: string[];
    isFavorite: boolean;
};
type Bus = {
    busNumber: string;
    basicInfo: Basic;
    moreInfo: More;
};

function normalizeBusData(data: any[]): Bus[] {
    return data.map((item) => ({
        busNumber: item.bus_number,
        basicInfo: {
            driverName: item.driver_name,
            conductor: item.conductor,
            busType: item.bus_type,
            routeName: item.route_name,
            busStatus: item.bus_status,
        },
        moreInfo: {
            currentLocation: item.current_location,
            nextStop: item.next_stop,
            lastUpdated: item.last_updated,
            etaToNextStop: item.eta_to_next_stop,
            startTime: item.start_time,
            endTime: item.end_time,
            totalStops: item.stops?.map((s: any) => s.stop_name) || [],
            currentStop: item.current_stop,
            driverContact: item.driver_phonenumber,
            busFrequency: item.frequency,
            passengerCountStatus: item.passenger_count_status,
            alerts: item.alerts || [],
            isFavorite: false,
        },
    }));
}

export default function BusCard({ bus }: { bus: Bus }) {
    return (
        <View className="bg-white rounded-2xl shadow-md p-4 mb-4">
            
            {/* Header */}
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center space-x-3">
                    <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
                        <Bus size={24} color="#22c55e" strokeWidth={1.5} />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-gray-900">{bus.busNumber}</Text>
                        <Text className="text-sm text-gray-500">{bus.basicInfo.routeName}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Star
                        size={20}
                        color={bus.moreInfo.isFavorite ? "#facc15" : "#9ca3af"}
                        fill={bus.moreInfo.isFavorite ? "#facc15" : "transparent"}
                    />
                </TouchableOpacity>
            </View>

            {/* Times */}
            <View className="flex-row justify-between mt-3">
                <View className="flex-row items-center space-x-1">
                    <Clock size={14} color="#6b7280" />
                    <Text className="text-gray-700 text-sm">{bus.moreInfo.startTime} - {bus.moreInfo.endTime}</Text>
                </View>
                <Text className="text-green-500 text-sm font-medium">ETA: {bus.moreInfo.etaToNextStop}</Text>
            </View>

            {/* Info */}
            <View className="mt-3 space-y-1">
                <Text className="text-gray-700">
                    Driver: <Text className="font-semibold">{bus.basicInfo.driverName}</Text>{" "}
                    | <Text className="font-semibold">{bus.moreInfo.driverContact}</Text>
                </Text>
                <Text className="text-gray-700">
                    Conductor: <Text className="font-semibold">{bus.basicInfo.conductor}</Text>
                </Text>
                <Text className="text-gray-700">
                    Type: <Text className="font-semibold">{bus.basicInfo.busType}</Text>
                </Text>
                <Text className="text-gray-700">
                    Status:{" "}
                    <Text className={`font-semibold ${bus.basicInfo.busStatus === "ACTIVE" ? "text-green-600" : "text-red-500"}`}>{bus.basicInfo.busStatus}</Text>
                </Text>
            </View>

            {/* Stops */}
            <View className="mt-3">
                <Text className="text-gray-700 font-medium">Stops ({bus.moreInfo.totalStops.length}):</Text>
                <Text className="text-gray-500 text-sm">{bus.moreInfo.totalStops.join(" → ")}</Text>
            </View>

            {/* Alerts */}
            {bus.moreInfo.alerts.length > 0 && (
                <View className="flex-row items-center mt-3">
                    <AlertTriangle size={16} color="red" />
                    <Text className="text-red-600 ml-2 font-medium">{bus.moreInfo.alerts.join(", ")}</Text>
                </View>
            )}

            {/* Footer */}
            <View className="mt-3 flex-row justify-between">
                <Text className="text-gray-500 text-xs">Last updated: {bus.moreInfo.lastUpdated}</Text>
                <Text className="text-gray-500 text-xs">{bus.moreInfo.passengerCountStatus}</Text>
            </View>
        </View>
    );
}
