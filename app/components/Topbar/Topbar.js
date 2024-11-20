import React, { useEffect, useState } from 'react'
import {
    View, Text,
    StatusBar,
    StyleSheet,
    Image, TextInput,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import dog from './dog.png';
import cat from './cat.png';
import { useAuth } from '../../context/AuthContext';

const Topbar = () => {
    const navigation = useNavigation();
    const [petProfile, setPetProfile] = useState({})
    const { profile } = useAuth()
    

    useEffect(() => {
        if (profile) {
            setPetProfile(profile?.data?.id)
        } else {
            setPetProfile(null)
        }
    }, [profile]);


    return (
        <View style={Styles.container}>
            <StatusBar hidden={true} />
            <View style={Styles.topContainer}>
                <View className="mb-4" style={Styles.leftcontainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Image
                            source={petProfile?.PetType === 'Dog' ? dog : cat}
                            style={Styles.user} type='link'
                        />
                    </TouchableOpacity>
                    <View style={Styles.textContainer}>
                        <Text style={Styles.wel}>Welcome</Text>
                        <Text style={Styles.userName}>{petProfile?.PetName || "Pet Name"}</Text>
                    </View>
                </View>
                <View style={Styles.rhtcontainer}>
                    <TouchableOpacity onPress={() => alert("No New Notification")}>
                        <FontAwesome name="bell" size={17} color="#fff" style={Styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("cart")}>
                        <FontAwesome name="shopping-bag" size={16} color="#fff" style={Styles.icon} />
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        padding: 11,
        paddingBottom: 0,
        backgroundColor: "#FFFFFF",
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftcontainer: {
        flexDirection: "row",
        alignItems: 'center',
    },
    user: {
        width: 40,
        height: 40,
        objectFit: 'contain',
        borderRadius: 40 / 2,
        marginRight: 6,
    },
    textContainer: {
        justifyContent: 'center',
    },
    wel: {
        fontSize: 16,
        color: "#5EB07C",
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    userName: {
        fontSize: 16,
        letterSpacing: 0.2,
        fontWeight: '600'
    },
    rhtcontainer: {
        gap: 5,

        flexDirection: "row",
        alignItems: 'center',
    },
    icon: {
        width: 45,
        height: 45,
        padding: 14,
        borderRadius: 45 / 2,
        alignItems: "center",
        backgroundColor: "#4FAD65",
        justifyContent: "center",
    },
    searchContainer: {
        paddingTop: 10,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    searchBar: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
    },
    searchIcon: {
        padding: 10,
    },
})

export default Topbar