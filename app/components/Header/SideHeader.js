import { View, Text, SafeAreaView, StyleSheet, Dimensions,ScrollView, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const { height } = Dimensions.get('window');
export default function SideHeader({ isOpen, onClose }) {
    const slideAnim = useRef(new Animated.Value(-400)).current; // Adjust initial value based on width
    const navigation = useNavigation(); 
    useEffect(() => {
        if (isOpen) {
            // Animate to slide in
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Animate to slide out
            Animated.timing(slideAnim, {
                toValue: -400, // Adjust based on the width of your drawer
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen]);

    const links = [
        { id: '1', screenPath: 'Home', title: 'Home', iconName: 'home' },
        { id: '2', screenPath: 'Shop', title: 'Shop', iconName: 'shopping-cart' },
        { id: '3', screenPath: 'About', title: 'About', iconName: 'info-circle' },
        { id: '4', screenPath: 'Cart', title: 'Cart', iconName: 'shopping-basket' },
        { id: '5', screenPath: 'Referral', title: 'Referral', iconName: 'gift' },
        { id: '6', screenPath: 'Support', title: 'Support', iconName: 'support' },
        { id: '7', screenPath: 'Profile', title: 'Profile', iconName: 'user' },
        { id: '8', screenPath: 'Order', title: 'Order', iconName: 'shopping-cart' },

        { id: '9', screenPath: 'Logout', title: 'Logout', iconName: 'sign-out' }
    ];


    return (
        <Animated.View style={[styles.scrollContainer, { 
            transform: [{ translateX: slideAnim }],
            position: isOpen ? 'relative' : 'absolute' // Change position based on isOpen
        }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {links.map(link => (
                    <TouchableOpacity  onPress={() => navigation.navigate(link.screenPath)} key={link.id} style={styles.linkItem} >
                        {link.iconName && (
                            <>
                            
                            <View  style={styles.linkContent}>
                                <FontAwesome name={link.iconName} size={20} color="#A7CF44" style={styles.icon} />
                                <Text style={styles.linkText}>{link.title}</Text>
                            </View>
                                <FontAwesome name={'angle-right'} size={20} color="#A7CF44" style={styles.icon} />
                            </>
                        )}
                    </TouchableOpacity>
                ))}
                {/* Contact Information */}
                <View style={styles.contactContainer}>
                    <Text style={styles.contactText}>✉️: info@omsrisalesolutions.com</Text>
                    <Text style={styles.contactText}>📞: +91 82520 74655</Text>
                </View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
     
        left: 0,
        zIndex:99,
        width: '100%', 
        top:0,
        height:'100%',
        backgroundColor: '#f8f8ff',
        borderTopRightRadius: 20,
        borderBottomEndRadius: 20,
        paddingVertical: 10,
    },
    scrollContent: {
        paddingVertical: 10,
    },
    linkItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 0.2,
        borderBottomColor: '#121A2C',
    },
    linkContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    linkText: {
        marginLeft: 10,
        fontSize: 18,
    },
    icon: {
        width: 24,
        height: 24,
    },
    contactContainer: {
        padding: 15,
        backgroundColor: '#f0f0f0', // Light background for the contact info
        marginTop: 10,
    },
    contactText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#A7CF44',
    },
});
