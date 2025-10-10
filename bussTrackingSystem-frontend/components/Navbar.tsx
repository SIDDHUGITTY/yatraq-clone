import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { Menu, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import LoadingAnime from '../components/LoadingAnime';

const { width } = Dimensions.get('window');

const BottomNavBar = () => {
    const { role, setRole } = useAuth()
    const translateX = useRef(new Animated.Value(-width)).current;
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [Loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null);

    const minSwipeDistance = 50;

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('access_token');
            // console.log(storedToken, 'this is nav bar token')
            if (storedToken) {
                // decode token
                const decoded = jwtDecode(storedToken);
                setUser(decoded);
                // clg
                // console.log("Decoded JWT:", decoded);
            }
        };
        // Fetch live location
        // (async () => {
        //   let { status } = await Location.requestForegroundPermissionsAsync();
        //   if (status !== 'granted') {
        //     setLocation('Permission denied');
        //     return;
        //   }

        //   let loc = await Location.getCurrentPositionAsync({});
        //   let reverseGeocode = await Location.reverseGeocodeAsync({
        //     latitude: loc.coords.latitude,
        //     longitude: loc.coords.longitude,
        //   });

        //   if (reverseGeocode.length > 0) {
        //     let addr = reverseGeocode[0];
        //     setLocation(
        //       `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.postalCode || ''}`
        //     );
        //   } else {
        //     setLocation(`Lat: ${loc.coords.latitude}, Lng: ${loc.coords.longitude}`);
        //   }
        // })();
        fetchToken();
    }, []);

    const onTouchStart = (e: any) => {
        setTouchEnd(null);
        setTouchStart(e.nativeEvent.pageX);
    };

    const onTouchMove = (e: any) => {
        setTouchEnd(e.nativeEvent.pageX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (sidebarOpen && isLeftSwipe) {
            toggleSidebar();
        }
    };

    const toggleSidebar = () => {
        const nextState = !sidebarOpen;
        setSidebarOpen(nextState);
        Animated.timing(translateX, {
            toValue: nextState ? 0 : -width,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const LogOutHandler = async () => {
        setLoading(true)
        try {
            await AsyncStorage.removeItem('access_token'); // clear token
            // setLogin(null); // reset login state
            router.replace('/Login'); // navigate to login screen
        } catch (error) {
            console.log("Error clearing async storage:", error);
        } finally {
            setLoading(false)
        }
    }
    console.log(user?.role, 'from navbar')
    return (
        <View className='z-10 py-2 bg-gray-50'>
            <View className="flex-row items-center justify-between px-4 py-2">
                <TouchableOpacity className="p-2" onPress={toggleSidebar}>
                    <Menu color="black" size={24} />
                </TouchableOpacity>
                <View className='flex-1 flex-row justify-center items-center'>
                    <Text className="text-blue-500 text-3xl font-semibold">Yatra</Text>
                    <Image
                        source={require('../assets/images/btslogo.png')}
                        className="w-10 h-10"
                    />
                </View>
                <TouchableOpacity onPress={() => router.push('../Profile')}>
                    <Image
                        source={{ uri: user?.profile, }}
                        className="w-12 h-12 rounded-full"
                    />
                </TouchableOpacity>

                {sidebarOpen && (
                    <TouchableWithoutFeedback onPress={toggleSidebar}>
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '100%',
                            zIndex: 10,
                        }}
                        />
                    </TouchableWithoutFeedback>
                )}
                <Animated.View
                    style={{
                        transform: [{ translateX }],
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'white',
                        zIndex: 10,
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <View className='h-screen px-10 py-5 bg-white'>
                        {/* Swipe indicator */}
                        <View className="absolute top-4 right-2 w-1 h-8 bg-gray-300 rounded-full opacity-50" />

                        <TouchableOpacity onPress={toggleSidebar} className="mb-4 self-end">
                            <X color="black" size={28} />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-black text-4xl font-bold">Menu</Text>
                            <Text
                                className="text-black text-md font-semibold mt-5 border-b border-gray-300 px-3 py-5"
                                onPress={() => {
                                    router.push(`../${user?.role === 'PASSENGER' ? 'HomeScreen' : 'DriverHomeScreen'}`);
                                    toggleSidebar();
                                }}
                            >
                                <View className='flex-1 flex-row gap-2'>
                                    <Image source={require('../assets/images/house.png')} className='w-7 h-7' />
                                    <Text className='text-2xl'>Home</Text>
                                </View>
                            </Text>
                            {user?.role === 'PASSENGER' && (
                                <View>
                                    <Text
                                        className="text-black text-md font-semibold mt-5 border-b border-gray-300 px-3 py-5"
                                        onPress={() => {
                                            router.push('../Trips');
                                            toggleSidebar();
                                        }}
                                    >
                                        <View className='flex-1 flex-row gap-2'>
                                            <Image source={require('../assets/images/map.png')} className='w-7 h-7' />
                                            <Text className='text-2xl'>My Trips</Text>
                                        </View>
                                    </Text>
                                    <Text
                                        className="text-black text-md font-semibold mt-5 border-b border-gray-300 px-3 py-5"
                                        onPress={() => {
                                            router.push('../MyFvt');
                                            toggleSidebar();
                                        }}
                                    >
                                        <View className='flex-1 flex-row gap-2'>
                                            <Image source={require('../assets/images/favourite.png')} className='w-7 h-7' />
                                            <Text className='text-2xl'>My fvt</Text>
                                        </View>
                                    </Text>
                                </View>
                            )}
                            <Text
                                className="text-black text-md font-semibold mt-5 border-b border-gray-300 px-3 py-5"
                                onPress={() => {
                                    router.push('../Notification')
                                    toggleSidebar();
                                }}
                            >
                                <View className='flex-1 flex-row gap-2'>
                                    <Image source={require('../assets/images/bell.png')} className='w-7 h-7' />
                                    <Text className='text-2xl'>Notification</Text>
                                </View>
                            </Text>
                            <Text
                                className="text-black text-md font-semibold mt-10 border-b border-gray-300 px-3 py-5"
                                onPress={() => {
                                    router.push('../Feedback');
                                    toggleSidebar();
                                }}
                            >
                                <View className='flex-1 flex-row gap-2'>
                                    <Image source={require('../assets/images/chat.png')} className='w-8 h-8' />
                                    <Text className='text-2xl'>Feedback</Text>
                                </View>
                            </Text>
                            <Text
                                className="text-black text-md font-semibold mt-10 border-b border-gray-300 px-3 py-5"
                                onPress={() => {
                                    router.push('../TermsConditions');
                                    toggleSidebar();
                                }}
                            >
                                <View className='flex-1 flex-row gap-2'>
                                    <Image source={require('../assets/images/conditions.png')} className='w-8 h-8' />
                                    <Text className='text-2xl'>Terms & Conditions</Text>
                                </View>
                            </Text>
                            <Text
                                className="text-black text-md font-semibold mt-5 border-b border-gray-300 px-3 py-5"
                                onPress={() => {
                                    router.push('../AboutUs');
                                    toggleSidebar();
                                }}
                            >
                                <View className='flex-1 flex-row gap-2'>
                                    <Image source={require('../assets/images/info.png')} className='w-8 h-8' />
                                    <Text className='text-2xl'>About us</Text>
                                </View>
                            </Text>
                            <Text
                                className="text-black text-md font-semibold mt-5 border-b border-gray-300 px-3 py-5"
                                onPress={LogOutHandler}>
                                <View className='flex-1 flex-row gap-2'>
                                    <Image source={require('../assets/images/logout.png')} className='w-8 h-8' />
                                    <Text className='text-2xl'>Log Out</Text>
                                </View>
                            </Text>
                        </View>
                    </View>
                </Animated.View>
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
 
export default BottomNavBar;