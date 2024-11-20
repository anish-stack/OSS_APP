import React, { useEffect, useState } from 'react';
import './global.css';
import 'react-native-gesture-handler';
import { AppRegistry, ActivityIndicator, View } from 'react-native'; // Import ActivityIndicator
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { name as appName } from './app.json';
import Home from './screen/Home/Home';
import Toast from 'react-native-toast-message';
import OnBoard from './screen/onboardingscreenn/OnBoard';
import Register from './screen/auth/Regsiter'; // Corrected typo
import Login from './screen/auth/Login';
import SingleProduct from './components/Product/SingleProduct';
import Cart from './screen/Cart/Cart';
import { CartProvider } from './context/CartContaxt';
import CheckOutPage from './screen/CheckOutPage/CheckOutPage';
import SuccessPage from './screen/CheckOutPage/SuccessPage';
import OtpValidate from './screen/auth/OtpValidate';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store'; // Ensure correct path
import PasswordChange from './screen/auth/PasswordChange';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReferralScreen from './screen/Referral/ReferralScreen';
import Profile from './screen/Profile/Profile';
import AboutUs from './screen/About/About';
import Support from './screen/supports/Support';
import { loadCartFromStorage } from './redux/cart/CartSlice';
import Address from './screen/Cart/Address';
import Order from './screen/auth/Order';
import Shop from './screen/Shop/Shop';
import Withdrawal from './screen/Profile/Withdrawal';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initial, setInitial] = useState('onboard');
  const [loading, setLoading] = useState(true); // Loading state
  const tokenFromRedux = useSelector((state) => state.register.token);
  const dispatch = useDispatch()
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Retrieve token from AsyncStorage
        const tokenFromStorage = await AsyncStorage.getItem('token');

        // Check if there's a token from AsyncStorage or Redux
        if (tokenFromStorage || tokenFromRedux) {
          setInitial('Home');
        } else {
          setInitial('onboard'); // Redirect to onboard if no token
        }
      } catch (error) {
        console.error('Failed to retrieve token from AsyncStorage:', error);
      } finally {
        setLoading(false); // Set loading to false after token check
      }
    };

    checkToken();
  }, [tokenFromRedux]);

  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  if (loading) {
    // Show a loading indicator while checking token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <Stack.Navigator initialRouteName={initial}>
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='About' component={AboutUs} options={{ headerShown: true, title: "ABOUT US OF OSS" }} />
        <Stack.Screen name='Shop' component={Shop} options={{ headerShown: true, title: "Shop" }} />


        <Stack.Screen name='onboard' component={OnBoard} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={Register} options={{ headerShown: true }} />
        <Stack.Screen name='Otp-Verify' component={OtpValidate} options={{ headerShown: true }} />
        <Stack.Screen name='Checkout' component={Address} options={{ headerShown: true, title: "Checkout" }} />

        <Stack.Screen name='Product-information' component={SingleProduct} options={{ headerShown: false, title: 'Product Information' }} />
        <Stack.Screen name='Cart' component={Cart} options={{ headerShown: true, title: "Cart" }} />
        {/* <Stack.Screen name='Checkout' component={CheckOutPage} options={{ headerShown: true, title: 'Checkout💸' }} /> */}
        <Stack.Screen name='Order_Success' component={SuccessPage} options={{ headerShown: false }} />
        <Stack.Screen name='Order' component={Order} options={{ headerShown: true, title: "My Order" }} />
        <Stack.Screen name='Withdrawal' component={Withdrawal} options={{ headerShown: true, title: "Make a Withdrawal" }} />


        <Stack.Screen name='Login' component={Login} options={{ headerShown: true }} />
        <Stack.Screen name='Referral' component={ReferralScreen} options={{ headerShown: true }} />
        <Stack.Screen name='Support' component={Support} options={{ headerShown: true, title: 'Any Help From us !!' }} />

        <Stack.Screen name='Profile' component={Profile} options={{ headerShown: true }} />
        <Stack.Screen name='password-change' component={PasswordChange} options={{ headerShown: true, title: "Change Your Password" }} />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

const RootApp = () => (
  <Provider store={store}>
    <NavigationContainer>
      <App />
    </NavigationContainer>
  </Provider>
);

// Register the App Component
AppRegistry.registerComponent(appName, () => RootApp); // Register RootApp instead of App

export default RootApp; // Export RootApp as default
