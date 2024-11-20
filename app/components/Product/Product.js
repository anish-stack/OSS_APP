import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Share, Alert, ScrollView } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
import axios from 'axios';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleShare = async (productName, referralCode, discountPercent, afterDiscountPrice, productImage, productLink) => {
    try {
        const message = `*Introducing:* *${productName}*\n your partner in **boosting health** and immunity!\n- *💪 Nutritional Excellence:* Tailored for all demographics to meet essential needs.\n- *🛡️ Immunity Support:* A potent blend of vitamins, minerals, and antioxidants.\n- *🏭 Quality You Can Trust:* Produced in state-of-the-art facilities meeting international standards.\n- *💰 Discount:* *${discountPercent}% off!* Now available for just *${afterDiscountPrice}*!\n- *📜 Referral Code:* *${referralCode}*\n*🌿 Grab yours today and embark on your health journey!*\n🔗 *Find out more:* ${productLink}`;

        const result = await Share.share({
            message: message,
            url: productImage, // Add image URL to share
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // Do something if sharing was successful with activity type
            } else {
                Alert.alert('Product shared successfully!');
            }
        } else if (result.action === Share.dismissedAction) {
            Alert.alert('Sharing was dismissed');
        }
    } catch (error) {
        Alert.alert(error.message);
    }
};

const ProductSection = () => {
    const UserFromRedux = useSelector((state) => state.register.user);
    const [loading, setLoading] = useState(true); // Loading state
    const [userFromStorage, setUserFromStorage] = useState(null);
    const [data, setData] = useState([]);

    // Fetch referral code safely
    const referralCode = UserFromRedux?.referralCode || userFromStorage?.referralCode || "N/A";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user'); // Fetch user from AsyncStorage
                if (storedUser) {
                    setUserFromStorage(JSON.parse(storedUser)); // Parse and set user data
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUserData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.1.8:7000/api/v1/get-all-product');
            if (response.data) {
                setData(response.data.products);
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

    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>
                Our Veda <Text style={{ color: '#FFA500' }}>Vita Products</Text> 💪🍂🌿
            </Text>
            <ScrollView
                horizontal={true}
                contentContainerStyle={styles.grid}
                pagingEnabled={false}
                decelerationRate="fast"
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
            >
                {data.length > 0 ? (
                    data.map((item, index) => {
                        const { _id, name, description,catchLine,numberOfCapsule, discountPercent, mainPrice, images, afterDiscountPrice } = item;
                        return (
                            <View key={index} style={styles.card}>
                                <View style={styles.img_card}>
                                    {images && images.url ? (
                                        <Image source={{ uri: images.url }} style={styles.image} />
                                    ) : (
                                        <Image source={{ uri: 'fallback-image-url' }} style={styles.image} />
                                    )}
                                </View>
                                <Text style={styles.productName}>{name}</Text>
                                <Text style={styles.description}>{catchLine.substring(0, 80) + '....'}</Text>
                                <Text style={styles.priceContainer}>
                                    <Text style={styles.originalPrice}>Rs {mainPrice}</Text>
                                    <Text style={styles.discountedPrice}> Rs {afterDiscountPrice}</Text>
                                </Text>
                                <Text style={styles.discountedPrice}>Capsule in Bottle {numberOfCapsule}</Text>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Product-information', { _id })}
                                        style={styles.addButton}
                                    >
                                        <Text style={styles.buttonText}>Add to Cart 🛍️</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleShare(name, referralCode, discountPercent, description, afterDiscountPrice, images.url, 'https://play.google.com/store/apps/details?id=com.ludo.king&hl=en_IN')}
                                        style={styles.referButton}
                                    >
                                        <Text style={styles.buttonText}>Refer a Friend 🔗</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.badge}>{discountPercent}% off</Text>
                            </View>
                        );
                    })
                ) : (
                    <View>
                        <Text>No Products found</Text>
                    </View>
                )}
            </ScrollView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 12,
        backgroundColor: '#f0fffe',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 1,
        position: 'relative',
        margin: 8,
        padding: 7,
        minHeight: 340,
        width: SCREEN_WIDTH / 1.4,
        alignItems: 'flex-start',
    },
    img_card: {
        width: '100%',
        height: 150,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        objectFit: 'contain',
        marginBottom: 10,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    discountedPrice: {
        color: '#27ae60',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonContainer: {
        width: '100%',
        marginVertical: 10,
    },
    addButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    referButton: {
        backgroundColor: '#A7CF44',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    badge: {
        position: "absolute",
        top: 0,
        left: 0,
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

export default ProductSection;
