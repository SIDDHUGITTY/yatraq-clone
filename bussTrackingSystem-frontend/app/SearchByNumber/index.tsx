import Constants from 'expo-constants';
import { router } from 'expo-router';
import {
  Bus,
  Clock,
  MapPin,
  Search,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  // TouchableWithoutFeedback,
  View
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import LoadingAnime from '../../components/LoadingAnime';

const Index = () => {
  const API_URL = Constants.expoConfig?.extra?.API_URL;
  const [busNumber, setBusNumber] = useState("");
  const [busData, setBusData] = useState<BusType[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [Loading, setLoading] = useState(false)
  const [placeholderText, setPlaceholderText] = useState("Ex : TG10932");
  const [isInputFocused, setIsInputFocused] = useState(false);

  //interfaces
  type Stop = {
    status: string;
    stop_name: string;
    arrival_time: string;
    departure_time: string;
  };
  type BusType = {
    bus_number: string;
    drivercode: string;
    conductor_code: string;
    driver_phonenumber: string;
    conductor_phonenumber: string;
    bus_type: string;
    capacity: string | number;
    depo_id: string;
    departure_time: string;
    arrival_time: string;
    source_location_id: string;
    destination_location_id: string;
    trip_date: string;
    stops: Stop[];
  };

  const dummyBusData = [
    {
      bus_number: "TG09ES8765",
      drivercode: "DR001",
      conductor_code: "CD001",
      driver_phonenumber: "+91 98765 43210",
      conductor_phonenumber: "+91 98765 43211",
      bus_type: "AC Sleeper",
      capacity: 45,
      depo_id: "DEP001",
      departure_time: "08:00 AM",
      arrival_time: "06:00 PM",
      source_location_id: "Chennai",
      destination_location_id: "Bangalore",
      trip_date: "2024-01-15",
      stops: [
        { status: "Active", stop_name: "Chennai Central", arrival_time: "08:00 AM", departure_time: "08:15 AM" },
        { status: "Active", stop_name: "Vellore", arrival_time: "10:30 AM", departure_time: "10:45 AM" },
        { status: "Active", stop_name: "Bangalore City", arrival_time: "06:00 PM", departure_time: "06:00 PM" }
      ]
    },
    {
      bus_number: "TG09EW4356",
      drivercode: "DR002",
      conductor_code: "CD002",
      driver_phonenumber: "+91 98765 43212",
      conductor_phonenumber: "+91 98765 43213",
      bus_type: "Non-AC Seater",
      capacity: 52,
      depo_id: "DEP002",
      departure_time: "09:30 AM",
      arrival_time: "07:30 PM",
      source_location_id: "Kochi",
      destination_location_id: "Mumbai",
      trip_date: "2024-01-15",
      stops: [
        { status: "Active", stop_name: "Kochi Junction", arrival_time: "09:30 AM", departure_time: "09:45 AM" },
        { status: "Active", stop_name: "Mangalore", arrival_time: "02:00 PM", departure_time: "02:15 PM" },
        { status: "Active", stop_name: "Mumbai Central", arrival_time: "07:30 PM", departure_time: "07:30 PM" }
      ]
    }
  ];
  // const searchSuggestions = ["TG10932", "KL78945", "TN12345", "AP12345", "KA12345"];

  // Dynamic placeholder text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderText(prev =>
        prev === "Ex : TG10932" ? "Search by number" : "Ex : TG10932"
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  //webstokets code here
  useEffect(() => {
    // initialize socket
    const socket: Socket = io(API_URL, {
      transports: ["websocket"],
      query: { role: "passenger", busId: 'TS09Z1007' }, // pass role & busId in handshake
    });

    // when connected
    socket.on("connect", () => {
      console.log("✅ Passenger connected:", socket.id);

      // join the bus room after successful connection
      socket.emit("joinBusRoom", { busId: 'TS09Z1007' });
    });

    // when bus location updates
    socket.on("busLocationUpdate", (data: { lat: number; lng: number }) => {
      console.log("📍 Bus moved:", data, 'this is from searchby number component..');
      // 👉 here update your state for Google Maps marker
      // setBusLocation(data); 
    });

    // when disconnected
    socket.on("disconnect", () => {
      console.log("❌ Passenger disconnected");
    });

    // cleanup on unmount
    return () => {
      socket.disconnect();
      console.log("🔌 Socket closed on component unmount");
    };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/bustable/Busnumber`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busnumber: busNumber.toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Backend error handling
        setError(data?.message || "Bus not found");
        setBusData([]);
        setLoading(false);
        console.log(error, 'this is error from search by number')
        return;
      }

      // normalize
      const normalizedData = Array.isArray(data) ? data : data ? [data] : [];
      setBusData(normalizedData);
      setError(null);
      setLoading(false);

    } catch (err: any) {
      setError(err);
      setBusData([]);
    } finally {
      setLoading(false);
    }
  };

  const mapComponentHandler = async (busId: string) => {
    console.log('bus id from search by number...', busId)
    // console.log(busId,'this is search compo')
    router.push({ pathname: "/LiveBusMap", params: { busId: busId } });
  }

  return (
    // <TouchableWithoutFeedback onPress={() => setIsInputFocused(false)}>
    <View className='bg-white h-screen'>
      {/* img cart */}
      <View className="w-[100%] h-[25%] p-5">
        <View>
          <Image
            source={require('../../assets/images/findyourbuss.jpg')}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 16,
              resizeMode: 'cover'
            }}
          />
        </View>
      </View>
      <View className="w-full px-3 pb-4 gap-5 h-full">
        <View className="flex-1 mt-5 items-center pb-5 px-3">
          {/* Input */}
          <View className="flex-row items-center border-b-2 border-gray-300 px-4 py-3 gap-3">
            <View className='border-0 pr-2 border-r-2 border-r-gray-300'>
              <Bus size={30} color="black" />
            </View>
            <TextInput
              className="flex-1 text-black"
              placeholder={placeholderText}
              placeholderTextColor="gray"
              value={busNumber}
              onChangeText={setBusNumber}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <Search size={25} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Suggestions 
          {isInputFocused && (
            <View className="w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-2 max-h-48">
              <ScrollView className="p-2">
                <Text className="text-sm font-medium text-gray-600 mb-2 px-2">
                  Popular Bus Numbers
                </Text>
                {searchSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    className="flex-row items-center p-3 border-b border-gray-100 active:bg-gray-50"
                    onPress={() => {
                      setBusNumber(suggestion);
                      setIsInputFocused(false);
                    }}
                  >
                    <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                      <Bus size={16} color="#3b82f6" strokeWidth={1.5} />
                    </View>
                    <Text className="text-gray-800 font-medium">{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}*/}

          {/* Results */}
          <View className="border-none rounded-lg w-full h-[70%] my-1">
            <ScrollView className="p-1">
              {busData.length === 0 && !error ? (
                <>
                  <Text className="text-center text-2xl font-bold text-gray-600 mb-4">
                    Sample Bus Routes
                  </Text>
                  {dummyBusData.map((bus, idx) => {
                    const expanded = expandedId === bus.bus_number;
                    return (
                      <View
                        key={`dummy-${idx}`}
                        className="bg-white rounded-xl shadow-md mb-3 border-l-4 border-l-blue-500"
                      >
                        {/* Card */}
                        <TouchableOpacity
                          className="flex-row items-center justify-between w-full p-4 active:opacity-80"
                          onPress={() =>
                            setExpandedId(expanded ? null : bus.bus_number)
                          }
                        >
                          <View className="flex-row items-center space-x-3">
                            <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mx-2">
                              <Bus size={24} color="#3b82f6" strokeWidth={1.5} />
                            </View>
                            <View>
                              <Text className="font-semibold text-gray-900">
                                {bus.bus_number}
                              </Text>
                              <View className="flex-row items-center mt-1 gap-2">
                                <MapPin
                                  size={14}
                                  color="#6b7280"
                                  strokeWidth={1.5}
                                  className=''
                                />
                                <Text className="text-gray-500 text-sm">
                                  {bus.trip_date}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View className="items-end">
                            <View className="flex-row items-center gap-1">
                              <Clock
                                size={14}
                                color="#6b7280"
                                strokeWidth={1.5}
                              />
                              <Text className="font-semibold text-gray-900 text-sm">
                                {bus.departure_time}
                              </Text>
                            </View>
                            <Text className="text-green-500 text-sm font-medium">
                              {bus.arrival_time}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {expanded && (
                          <View className="px-4 pb-4 py-2 gap-2">
                            <Text className="text-gray-700">
                              Driver:{" "}
                              <Text className="font-semibold">{bus.drivercode}</Text>{" "}
                              |{" "}
                              <Text className="font-semibold">
                                {bus.driver_phonenumber}
                              </Text>
                            </Text>

                            <Text className="text-gray-700">
                              Conductor:{" "}
                              <Text className="font-semibold">
                                {bus.conductor_code}
                              </Text>{" "}
                              |{" "}
                              <Text className="font-semibold">
                                {bus.conductor_phonenumber}
                              </Text>
                            </Text>

                            <Text className="text-gray-700">
                              Type:{" "}
                              <Text className="font-semibold">{bus.bus_type}</Text>
                            </Text>

                            <Text className="text-gray-700">
                              Time:{" "}
                              <Text className="font-semibold">
                                {bus.departure_time} - {bus.arrival_time}
                              </Text>
                            </Text>

                            <View>
                              <Text className="text-gray-700 font-medium">
                                Stops:
                              </Text>
                              {bus.stops.map((stop, i) => (
                                <View key={i} className="ml-6">
                                  <Text className="text-gray-600">
                                    • {stop.stop_name} ({stop.status})
                                  </Text>
                                  <Text className="text-gray-500 text-sm">
                                    Arr: {stop.arrival_time} | Dep:{" "}
                                    {stop.departure_time}
                                  </Text>
                                </View>
                              ))}
                            </View>

                            <Text className="text-gray-700">
                              Capacity:{" "}
                              <Text className="font-semibold">{bus.capacity}</Text>
                            </Text>

                            <Text className="text-gray-700">
                              Depo ID:{" "}
                              <Text className="font-semibold">{bus.depo_id}</Text>
                            </Text>
                          </View>
                        )}

                        <TouchableOpacity
                          onPress={() =>
                            setExpandedId(expanded ? null : bus.bus_number)
                          }
                          className="border-t border-gray-200 py-2 mx-3"
                        >
                          <Text className="text-center text-blue-600 font-medium">
                            {expanded ? "Hide Details" : "See More"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </>
              ) : busData.length === 0 && error ? (
                <Text className="text-center text-3xl font-extrabold text-gray-400">
                  Error: {error || "Something went wrong"}
                </Text>
              ) : (
                busData.map((bus, idx) => {
                  const expanded = expandedId === bus.bus_number;

                  return (
                    <View
                      key={idx}
                      className="bg-white rounded-xl shadow-md mb-3"
                    >
                      {/* Card */}
                      <TouchableOpacity
                        className="flex-row items-center justify-between w-full p-4 active:opacity-80"
                      // onPress={() =>
                      //   setExpandedId(expanded ? null : bus.bus_number)
                      // }
                      >
                        <View className="flex-row items-center space-x-3">
                          <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mx-2">
                            <Bus size={24} color="#22c55e" strokeWidth={1.5} />
                          </View>
                          <View>
                            <Text className="font-semibold text-gray-900">
                              {bus.bus_number}
                            </Text>
                            <View className="flex-row items-center mt-1 gap-2">
                              <MapPin
                                size={14}
                                color="#6b7280"
                                strokeWidth={1.5}
                                className=''
                              />
                              <Text className="text-gray-500 text-sm">
                                {bus.trip_date}
                              </Text>
                            </View>
                            <View className="flex-col gap-1 mt-1">
                              <Text>Form : {bus.source_location_id}</Text>
                              <Text>To : {bus.destination_location_id}</Text>
                            </View>
                          </View>
                        </View>

                        {/* this is for map icon when user click on this map will open */}

                        <TouchableOpacity
                          className='border-0 pr-2 border-r-2 border-r-gray-300'
                          onPress={() => mapComponentHandler(bus.bus_number)}
                        >
                          <MapPin size={30} color="black" />
                        </TouchableOpacity>

                        <View className="items-end">
                          <View className="flex-row items-center gap-1">
                            <Clock
                              size={14}
                              color="#6b7280"
                              strokeWidth={1.5}
                            />
                            <Text className="font-semibold text-gray-900 text-sm">
                              {bus.departure_time}
                            </Text>
                          </View>
                          <Text className="text-green-500 text-sm font-medium">
                            {bus.arrival_time}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {expanded && (
                        <View className="px-4 pb-4 py-2 gap-2">
                          <Text className="text-gray-700">
                            Driver:{" "}
                            <Text className="font-semibold">{bus.drivercode}</Text>{" "}
                            |{" "}
                            <Text className="font-semibold">
                              {bus.driver_phonenumber}
                            </Text>
                          </Text>

                          <Text className="text-gray-700">
                            Conductor:{" "}
                            <Text className="font-semibold">
                              {bus.conductor_code}
                            </Text>{" "}
                            |{" "}
                            <Text className="font-semibold">
                              {bus.conductor_phonenumber}
                            </Text>
                          </Text>

                          <Text className="text-gray-700">
                            Type:{" "}
                            <Text className="font-semibold">{bus.bus_type}</Text>
                          </Text>

                          <Text className="text-gray-700">
                            Time:{" "}
                            <Text className="font-semibold">
                              {bus.departure_time} - {bus.arrival_time}
                            </Text>
                          </Text>

                          <View>
                            <Text className="text-gray-700 font-medium">
                              Stops:
                            </Text>
                            {bus.stops.map((stop, i) => (
                              <View key={i} className="ml-6">
                                <Text className="text-gray-600">
                                  • {stop.stop_name} ({stop.status})
                                </Text>
                                <Text className="text-gray-500 text-sm">
                                  Arr: {stop.arrival_time} | Dep:{" "}
                                  {stop.departure_time}
                                </Text>
                              </View>
                            ))}
                          </View>

                          <Text className="text-gray-700">
                            Capacity:{" "}
                            <Text className="font-semibold">{bus.capacity}</Text>
                          </Text>

                          <Text className="text-gray-700">
                            Depo ID:{" "}
                            <Text className="font-semibold">{bus.depo_id}</Text>
                          </Text>

                          {/* <View className="flex-row items-center gap-2">
                          <AlertTriangle size={18} color="red" />
                          <Text className="text-red-600 font-medium">
                            Alerts: (coming soon)
                          </Text>
                        </View> */}
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={() =>
                          setExpandedId(expanded ? null : bus.bus_number)
                        }
                        className="border-t border-gray-200 py-2 mx-3"
                      >
                        <Text className="text-center text-blue-600 font-medium">
                          {expanded ? "Hide Details" : "See More"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </View>
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

export default Index;
