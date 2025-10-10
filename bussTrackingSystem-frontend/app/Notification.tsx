// components/NotificationToggleCard.tsx
import { Bell, DownloadCloud } from 'lucide-react-native';
import { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

const NotificationToggleCard = () => {
    const [isEnabled, setIsEnabled] = useState(true);

    const toggleSwitch = () => setIsEnabled((prev) => !prev);

    return (
        <View className='py-5 px-8'>
            <View className="bg-white rounded-xl p-4 flex-row items-center justify-between mb-4 shadow-md border border-gray-200">
                <View className="flex-row items-center gap-3">
                    <Bell size={22} color="#1E3A8A" />
                    <Text className="text-base font-medium text-black">Enable Notifications</Text>
                </View>
                <Switch
                    value={isEnabled}
                    onValueChange={toggleSwitch}
                    trackColor={{ false: '#D1D5DB', true: '#60A5FA' }}
                    thumbColor={isEnabled ? '#2563EB' : '#9CA3AF'}
                />
            </View>
            <View className="bg-white rounded-xl p-4 shadow-md border border-gray-200 mb-4">
                <View className="flex-row items-start gap-3">
                    <DownloadCloud size={24} color="#22C55E" />
                    <View className="flex-1">
                        <Text className="font-semibold text-base text-black">New Update Available</Text>
                        <Text className="text-sm text-gray-600 mt-1">
                            Version 2.1.0 is out now! This update includes performance improvements and bug fixes.
                        </Text>
                        <TouchableOpacity className="mt-3 bg-green-600 px-4 py-2 rounded-full self-start">
                            <Text className="text-white font-medium text-sm">Update Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default NotificationToggleCard;
