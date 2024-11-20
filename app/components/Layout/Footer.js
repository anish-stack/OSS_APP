import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation } from '@react-navigation/native';

const Footer = () => {

  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-between px-2.5 bg-white shadow">
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("home")}
      >
        <FontAwesome name="home" size={25} color={"#A7CF44"} />
        <Text className="text-black text-[10px]">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("About")}
      >
        <FontAwesome name="info-circle" size={25} color={"#A7CF44"} />
        <Text className="text-black text-[10px]">About</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("Shop")}
      >
        <FontAwesome name="shopping-cart" size={25} color={"#A7CF44"} />
        <Text className="text-black text-[10px]">Shop</Text>
      </TouchableOpacity>

      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("Referral")}
      >
        <FontAwesome name="gift" size={25} color={"#A7CF44"} />
        <Text className="text-black text-[10px]">Referral</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("Support")}
      >
        <FontAwesome name="support" size={24} color={"#A7CF44"} />
        <Text className="text-black text-[10px]">Support</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("Profile")}
      >
        <FontAwesome name="user" size={25} color={"#A7CF44"} />
        <Text className="text-black text-[10px]">Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Footer