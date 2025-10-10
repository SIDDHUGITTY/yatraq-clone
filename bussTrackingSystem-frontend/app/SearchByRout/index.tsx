import axios from 'axios';
import Constants from 'expo-constants';
import { MapPin, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BusCard from '../../components/BusCard';
import LoadingAnime from '../../components/LoadingAnime';


const FromToSearch = () => {
    const API_URL = Constants.expoConfig?.extra?.API_URL;
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [buses, setBuses] = useState<Bus[]>([]);
    const [error, setError] = useState<any>(null)
    const [Loading, setLoading] = useState(false)

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

    const normalizeBusData = (data: any[]) => {
        return data.map(bus => ({
            busNumber: bus.BusNumber ?? "N/A",
            basicInfo: {
                driverName: bus.driver_phonenumber ?? "Unknown",
                conductor: bus.counductor_phonenumber ?? "Unknown",
                busType: bus.BusType ?? "Standard",
                // ...existing code...
                routeName:
                    bus.Source && bus.Destination
                        ? `${bus.Source} → ${bus.Destination}`
                        : "Not Assigned",
                // ...existing code...
                busStatus: bus.Status ?? "Inactive",
            },
            moreInfo: {
                currentLocation: bus.Stops?.[0]?.stop_name ?? bus.Source ?? "Unknown",
                nextStop: bus.Stops?.[1]?.stop_name ?? "N/A",
                lastUpdated: bus.TripDate ?? null,
                etaToNextStop: bus.Stops?.[1]?.arrival_time ?? null,
                startTime: bus.Departure ?? null,
                endTime: bus.Arrival ?? null,
                driverContact: bus.driver_phonenumber ?? null,
                totalStops: bus.Stops?.map((stop: any) => stop.stop_name) ?? [],
                currentStop: bus.Stops?.find((stop: any) => stop.status === "ACTIVE")?.stop_name ?? "Unknown",
                alerts: [], // No alerts in API
                passengerCountStatus: "", // Not in API
                busFrequency: "", // Not in API
                isFavorite: false,
            },
        }));
    };

    //changed to axios methods but not checkd output yet so after connecting to backend chick this logic
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/timing/sourcedestination`, {
                source_location_id: from,
                destination_location_id: to
                // body: JSON.stringify({
                // headers: { "Content-Type": "application/json" },
                // }),
            });
            // const data = await res.json();
            console.log("raw api data --------", res);

            const normalizedData = Array.isArray(res) ? normalizeBusData(res) : [];
            setBuses(normalizedData);
            console.log(normalizedData, 'this is normalizedData')
            console.log(buses, 'this is state data')
            setError(null);
        } catch (err: any) {
            console.error("error fetching buses:", err);
            setError(err);
            setBuses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("busData updated:", buses);
    }, [buses]);


    // setBuses(results);
    // const results = res.filter(bus =>
    //     bus.moreInfo.totalStops.some(
    //         stop =>
    //             stop.toLowerCase().includes(from.toLowerCase()) ||
    //             stop.toLowerCase().includes(to.toLowerCase())
    //     )
    // );

    return (
        <View className="flex-1 px-5 py-4">
            {/* Search Form */}
            <View className="w-full px-5 py-4 gap-5 border border-gray-300 rounded-2xl">
                <Text className="font-bold text-center text-2xl text-[#1E40AF]">Find Your Bus</Text>

                {/* From Input */}
                <View className="flex-row items-center border-b-2 border-gray-500 px-4 py-3 space-x-3">
                    <MapPin size={20} color="#1E40AF" />
                    <TextInput
                        className="flex-1 text-[#1E40AF]"
                        placeholder="From"
                        placeholderTextColor="#94a3b8"
                        value={from}
                        onChangeText={setFrom}
                    />
                </View>

                {/* To Input */}
                <View className="flex-row items-center border-b-2 border-gray-500 px-4 py-3 space-x-3">
                    <MapPin size={20} color="#1E40AF" />
                    <TextInput
                        className="flex-1 text-[#1E40AF]"
                        placeholder="To"
                        placeholderTextColor="#94a3b8"
                        value={to}
                        onChangeText={setTo}
                    />
                </View>

                {/* Search Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-[#1E40AF] py-3 rounded-xl flex-row justify-center items-center space-x-2"
                >
                    <Search size={18} color="#fff" />
                    <Text className="text-white px-2 font-bold text-base">Search</Text>
                </TouchableOpacity>
            </View>

            {/* Search Results */}
            <ScrollView className="mt-5">
                {buses.length > 0 ? (
                    buses.map((bus, index) => <BusCard key={index} bus={bus} />)
                ) : (
                    <Text className="text-center text-gray-400 mt-10">No buses found 🚏</Text>
                )}
            </ScrollView>

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
};

export default FromToSearch;