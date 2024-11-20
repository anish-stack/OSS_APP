import React from 'react';
import {
    View, Text,
    StatusBar,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProductTopBar = ({ isShow }) => {

    const navigation = useNavigation();

    return (
        <View className={`p-2 shadow-sm border-[0.5px] border-gray-300 pb-0 ${isShow ? 'bg-[#4FAD65]' : ''}`}>
            <StatusBar hidden={true} />
            <View className={`flex-row ${isShow ? '' : 'justify-between'} items-center`}>
                {/* Back Icon */}
                <View className=" items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                        <FontAwesome name="arrow-left" size={20} color={`${isShow ? '#fff' : '#000'}`} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className={`w-2/3 bg-white border border-gray-300 rounded-lg flex-row items-center mx-2 ${isShow ? '' : 'hidden'} `}>
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#999"
                        className="flex-1 h-10 px-3"
                    />
                    <FontAwesome name="search" size={20} color="#000" style={styles.searchIcon} />
                </View>

                {/* Cart Icon */}
                <View className="w-1/5 items-center">
                    <TouchableOpacity onPress={() => navigation.navigate("cart")} className="p-2">
                        <View className="w-11 h-11 p-3 bg-white rounded-full items-center justify-center">
                            <FontAwesome name="shopping-cart" size={20} color="#4FAD65" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    searchIcon: {
        position: 'absolute',
        right: 15,
    },
});
export default ProductTopBar;
