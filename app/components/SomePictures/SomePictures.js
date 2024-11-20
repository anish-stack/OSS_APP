import { View, Text, Image, Animated, Dimensions, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background
import imageFirst from '../../images/image1.png';
import imageTwo from '../../images/image2.png';
import imageThree from '../../images/Refer.png';
import Video from 'react-native-video';
import videoSource from './Product.gif'
export default function SomePictures() {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Fade-in animation
    const scaleAnim = useRef(new Animated.Value(0.8)).current; // Scale animation

    // Animation for fading in the content and scaling up the images
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            {/* Gradient Background for better aesthetics */}
            <LinearGradient colors={['#f8f8ff', '#e0f7fa']} style={{ flex: 1, paddingVertical: 20 }}>
                <Text className="text-center p-4 rounded-2xl font-bold text-3xl tracking-wide text-[#003873]">
                    Ayurveda Makes <Text className="text-green-600">Your Wealth</Text> and Health...
                </Text>

                {/* First Row */}
                <View className="flex-row justify-between mt-8 px-4">
                    {/* First Column */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="w-40 h-60 bg-white shadow-lg rounded-2xl items-center justify-center p-4">
                        <View className="w-32 h-28 bg-[#f0fffe] rounded-full items-center justify-center">
                            <Image source={imageFirst} className="w-full h-full" />
                        </View>
                        <Text className="text-base text-slate-700 font-semibold mt-4 text-center">
                            Build Your Health 🌿 With Pure Medicines
                        </Text>
                    </Animated.View>

                    {/* Second Column */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="w-40 h-60 bg-white shadow-lg rounded-2xl items-center justify-center p-4">
                        <View className="w-32 h-28 bg-[#f0fffe] rounded-full items-center justify-center">
                            <Image source={imageTwo} className="w-full h-full" />
                        </View>
                        <Text className="text-base text-slate-700 font-semibold mt-4 text-center">
                            Boost Your Energy ⚡ With Vita Day
                        </Text>
                    </Animated.View>
                </View>

                {/* Second Row */}
                <View className="flex-row justify-between mt-8 px-4">
                    {/* Third Column */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="w-40 h-60 bg-white shadow-lg rounded-2xl items-center justify-center p-4">
                        <View className="w-32 h-28 bg-[#f0fffe] rounded-full items-center justify-center">
                            <Image source={imageThree} className="w-full h-full" />
                        </View>
                        <Text className="text-base text-slate-700 font-semibold mt-4 text-center">
                            Earn Money 💸 by Referring Friends
                        </Text>
                    </Animated.View>

                    {/* Fourth Column */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="w-40 h-60 bg-white shadow-lg rounded-2xl items-center justify-center p-4">
                        <View className="w-32 h-28 bg-[#f0fffe] rounded-full items-center justify-center">
                            <Image source={imageTwo} className="w-full h-full" />
                        </View>
                        <Text className="text-base text-slate-700 font-semibold mt-4 text-center">
                            Stay Fit 💪 With Healthy Living
                        </Text>
                    </Animated.View>
                </View>
            </LinearGradient>

            <Text className="text-center p-4 rounded-2xl font-bold text-3xl tracking-wide text-[#003873]">
                Veda <Text className="text-orange-600">Vita</Text> Power Of Health 💪🍂🌿
            </Text>
           
        </Animated.View>
    );
}
const styles = StyleSheet.create({

    video: {
        width: Dimensions.get('window').width, // Full width of the device
        height: 700, // Height of the video player
    },
});