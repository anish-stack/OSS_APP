import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import AddToCartModel from './AddToCartModel';
import TopHeader from '../Header/TopHeader';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cart/CartSlice';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SingleProduct() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cart);
    const route = useRoute();
    const { _id } = route.params;
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.1.8:7000/api/v1/get-all-product');
            if (response.data && response.data.products) {
                const foundProduct = response.data.products.find((item) => item._id === _id);
                if (foundProduct) {
                    setData(foundProduct);
                } else {
                    Alert.alert('Product not found');
                }
            } else {
                Alert.alert('No products found');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error fetching products');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddToCart = (product) => {
        dispatch(addToCart({ ...product, quantity }));
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleIncreaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <>
            <TopHeader />
            <ScrollView contentContainerStyle={styles.container}>
                {data && ( // Check if data is available
                    <>
                        <View style={styles.img_card}>
                            <Image source={{ uri: data.images.url }} style={styles.image} />
                        </View>
                        <Text className="text-xl font-bold text-green-600 mb-2">{data.name}</Text>
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-xl mt-3 font-semibold text-green-700">
                                Rs {data.afterDiscountPrice} /
                                <Text className="line-through text-sm text-red-600"> Rs {data.mainPrice}</Text>
                            </Text>

                        </View>
                        <Text className="text-red-600 font-bold text-[14px] bg-violet-200 py-1 mb-4  whitespace-nowrap  rounded-lg shadow-md">
                            ⚡ This Price is Only Available for {data?.priceChange} Days!
                        </Text>

                        <View className="bg-white shadow-md px-2 rounded-lg mb-6">
                            <Text className="text-gray-700 text-[16px] mb-4">{data.catchLine}</Text>
                            <View className="border-t border-gray-200 my-4" />
                            <Text className="text-gray-600 font-medium mb-2">
                                Number of Capsules:
                                <Text className="font-semibold text-gray-800"> {data.numberOfCapsule}</Text>
                            </Text>

                        </View>

                        <View className="w-full flex-row items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-lg">
                            <TouchableOpacity
                                onPress={handleDecreaseQuantity}
                                className="bg-green-500 px-6 py-2 rounded-l-lg active:bg-green-600 transition duration-200"
                            >
                                <Text className="text-white text-lg font-bold">-</Text>
                            </TouchableOpacity>

                            <Text className="mx-4 text-xl font-semibold">{quantity}</Text>

                            <TouchableOpacity
                                onPress={handleIncreaseQuantity}
                                className="bg-blue-500 px-6 py-2 rounded-r-lg active:bg-blue-600 transition duration-200"
                            >
                                <Text className="text-white text-lg font-bold">+</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => handleAddToCart(data)} className="bg-green-600 py-3 rounded-lg mb-4">
                            <Text className="text-white text-lg text-center">Add to Cart</Text>
                        </TouchableOpacity>

                        <Text className="text-lg font-bold mt-6 mb-2">Offers:</Text>
                        <View className="bg-green-100 p-4 rounded-lg shadow-md mb-6">
                            <Text className="text-lg font-bold text-green-600 mb-2">🎉 Exclusive Offer!</Text>
                            <Text className="text-gray-800 mb-2">
                                Get <Text className="font-semibold text-green-600">10% off</Text> on your first order!
                            </Text>
                            <Text className="text-xl font-bold text-slate-700">
                                Use code: <Text className="bg-violet-200 font-semibold">FIRST10</Text>
                            </Text>
                            <Text className="text-gray-600 mt-2">
                                Hurry, limited time offer!
                            </Text>
                        </View>
                        <Text className="text-gray-800 mb-6 text-base leading-relaxed bg-gray-100 p-1 rounded-lg shadow-md">
                            <Text className="text-green-600 font-medium mb-4">
                                Dosage For A Person :
                                <Text className="font-semibold text-gray-800"> {data.doge}</Text>
                            </Text>
                        </Text>
                        <Text className="text-lg font-bold mt-6 mb-2">Additional Information:</Text>
                        <Text className="text-gray-800 mb-6 text-base leading-relaxed bg-gray-100 p-1 rounded-lg shadow-md">
                            <Text className="text-green-600 font-medium mb-4">
                                Description :
                                <Text className="font-semibold text-gray-800"> {data.description}</Text>
                            </Text>
                        </Text>

                        {/* <Text className="text-xl font-semibold mb-2">Customer Reviews:</Text> */}
                        {/* <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.reviewContainer}>
                            {data.reviews && data.reviews.map((review, index) => (
                                <View key={index} style={styles.reviewCard}>
                                    <Image source={{ uri: review.image }} style={styles.reviewImage} />
                                    <Text className="font-bold">{review.name}</Text>
                                    <Text>{'⭐'.repeat(review.rating)}</Text>
                                    <Text className="text-lg">{review.comment}</Text>
                                </View>
                            ))}
                        </ScrollView> */}
                    </>
                )}
                <Text style={styles.badge}>{data?.discountPercent}% off</Text>

            </ScrollView>
            <AddToCartModel
                ProductPrice={data?.afterDiscountPrice}
                ProductName={data?.name}
                productImage={data?.images?.url}
                quantity={quantity}
                isClose={handleClose}
                isOpen={open}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        position: "relative",
        paddingBottom: 32,
    },
    img_card: {
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 16,

    },
    image: {
        width: SCREEN_WIDTH - 32,
        height: 300,
        borderRadius: 10,
        resizeMode: 'contain',
    },
    reviewContainer: {
        paddingVertical: 8,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
        width: 200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    reviewImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 4,
    },
    badge: {
        position: "absolute",
        top: 0,
        left: 0,
        marginTop: 12,
        marginLeft: 12,
        backgroundColor: "#FF5733",
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        color: "#fff",
        fontSize: 12,
        fontWeight: 'bold',
    },
});
