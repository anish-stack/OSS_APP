import { View, Text, SafeAreaView, StyleSheet, StatusBar, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import logo from './logo.png';
import SideHeader from './SideHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { useCart } from '../../context/CartContaxt';
import { useSelector } from 'react-redux';

export default function TopHeader() {
    const [open, setOpen] = useState(false);
    const navigation = useNavigation()
    const handleOpen = () => {
        setOpen(!open);
    };
    const { cart } = useSelector((state) => state.cart);

    // const { cartItemCount } = useCart(); 


    return (
        <>
            <View style={styles.headerContainer}>
                {open ? (
                    <FontAwesome onPress={handleOpen} name="close" size={24} color="#A7CF44" style={styles.icon} />
                ) : (
                    <FontAwesome onPress={handleOpen} name="bars" size={24} color="#A7CF44" style={styles.icon} />
                )}
                <Image source={logo} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartContainer}>
                    <FontAwesome name="shopping-cart" size={24} color="#A7CF44" style={styles.icon} />
                    {cart.length > 0 && (
                        <View style={styles.cartCountContainer}>
                            <Text style={styles.cartCountText}>{cart.length || 0}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <SideHeader isOpen={open} />
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 0,
    },
    headerContainer: {
        width: '100%',
        paddingVertical: 15,
        backgroundColor: '#f8f8ff', // Light color for a fresh look
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    icon: {
        padding: 5,
    },
    cartContainer: {
        position: 'relative',
    },
    cartCountContainer: {
        position: 'absolute',
        right: -10,
        top: -10,
        backgroundColor: '#0E182B',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    cartCountText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
