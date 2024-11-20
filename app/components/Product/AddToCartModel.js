import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

export default function AddToCartModel({ ProductPrice, ProductName, productImage, quantity, isOpen, isClose }) {
    const slideAnim = useRef(new Animated.Value(500)).current; // Initial position off-screen

    useEffect(() => {
        if (isOpen) {
            // Animate to slide in
            Animated.timing(slideAnim, {
                toValue: 0, // Final position (on-screen)
                duration: 300, // Animation duration
                useNativeDriver: true, // Use native driver for better performance
            }).start();
        } else {
            // Animate to slide out
            Animated.timing(slideAnim, {
                toValue: 500, // Reset to off-screen
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen, slideAnim]);

    if (!isOpen) return null;

    return (
        <View className="fixed inset-0  flex items-center justify-center  z-50">
            <Animated.View
                style={{
                    transform: [{ translateY: slideAnim }],
                }}
                className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md"
            >
                <TouchableOpacity onPress={isClose} className="absolute  right-4">
                    <Text className="text-gray-500 text-2xl font-semibold">✖</Text>
                </TouchableOpacity>

                <View className="overflow-hidden h-48 rounded-lg shadow-md mb-4">
                    <Image
                        resizeMethod='contain'
                        resizeMode='contain'
                        source={{ uri: productImage }}
                        className="w-full h-full object-cover"
                    />
                </View>

                <Text className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                    Item Added to Cart
                </Text>
                <Text className="text-lg text-gray-700 mb-4 text-center font-medium">
                    <Text className="font-bold text-green-600">{ProductName}</Text>
                    <Text className="font-medium text-gray-600"> - Quantity: </Text>
                    <Text className="font-bold text-green-600">{quantity}</Text>
                
                    <Text className="font-medium text-gray-600"> - Total Price: </Text>
                    <Text className="font-bold text-green-600">Rs {(ProductPrice * quantity).toFixed(2)}</Text>
                </Text>


                <TouchableOpacity onPress={isClose} className="bg-green-600 py-3 rounded-lg">
                    <Text className="text-white text-lg text-center font-semibold">Continue Shopping</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
