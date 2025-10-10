import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Feedback = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState('');
    const [busNumber, setBusNumber] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!userName || !message) {
            Alert.alert('Missing Fields', 'Please fill out all fields 😅');
            return;
        }
        try {
            const res = await fetch('http://10.73.213.97:3000/feed-back/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: userName,
                    feedback: message
                })
            })
            const data = res.json()
            console.log(data)
        } catch (err) {
            console.log(err, 'from try catch method')
        }

        // 🔥 You can send this to a backend here
        console.log('Feedback Submitted:', {
            userName,
            busNumber,
            message,
            timestamp: new Date().toLocaleString(),
        });

        setSubmitted(true);

        // Reset after 2 seconds
        setTimeout(() => {
            setUserName('');
            setBusNumber('');
            setMessage('');
            setSubmitted(false);
        }, 2000);
    };
    // const feedbackData = [
    //     {
    //         id: 1,
    //         userName: 'Ravi Kumar',
    //         busNumber: 'TS1234',
    //         message: 'Driver was very polite and helpful.',
    //         timestamp: '2025-08-01 10:30 AM',
    //     },
    //     {
    //         id: 2,
    //         userName: 'Priya Sharma',
    //         busNumber: 'TS5678',
    //         message: 'Bus was late by 15 mins.',
    //         timestamp: '2025-08-01 9:45 AM',
    //     },
    //     {
    //         id: 3,
    //         userName: 'Anil Reddy',
    //         busNumber: 'TS9012',
    //         message: 'Clean bus and smooth ride!',
    //         timestamp: '2025-07-31 4:20 PM',
    //     },
    // ];

    // const filteredFeedback = feedbackData.filter((feedback) => {
    //     const combined = `${feedback.userName} ${feedback.busNumber} ${feedback.message}`.toLowerCase();
    //     return combined.includes(searchTerm.toLowerCase());
    // });

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold text-black mt-4 mb-6">Submit Feedback 📝</Text>

            <TextInput
                placeholder="Your Name"
                value={userName}
                onChangeText={setUserName}
                className="bg-gray-200 p-3 rounded-xl mb-4 text-black"
            />
            {/* 
                <TextInput
                    placeholder="Bus Number (e.g. TS1234)"
                    value={busNumber}
                    onChangeText={setBusNumber}
                    className="bg-gray-200 p-3 rounded-xl mb-4 text-black"
                /> */}

            <TextInput
                placeholder="Your Feedback..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                className="bg-gray-200 p-3 rounded-xl mb-4 text-black h-32 text-start"
            />

            <TouchableOpacity
                className="bg-blue-600 py-3 rounded-xl"
                onPress={handleSubmit}
            >
                <Text className="text-white text-center font-semibold text-lg">Submit</Text>
            </TouchableOpacity>

            {submitted && (
                <View className="mt-6 bg-green-100 p-4 rounded-xl border border-green-400">
                    <Text className="text-green-700 font-semibold text-center">✅ Feedback submitted successfully!</Text>
                </View>
            )}
        </View>
    );
};

export default Feedback;
