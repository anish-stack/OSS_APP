import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Create the async thunk for user registration
export const registerUser = createAsyncThunk(
  'user/register',
  async ({ submitData, navigate }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.1.8:7000/api/v1/Create-User', submitData);

      const { token, user } = response.data;

      // Save token and user data to AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Please Verify Your Email with OTP',
      });

      // Navigate to the OTP verification screen
      navigate('Otp-Verify');

      return { token, user };
    } catch (error) {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.msg || 'Something went wrong!',
      });
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create the async thunk for user login
export const login = createAsyncThunk(
  'user/login',
  async ({ submitData, navigate }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.1.8:7000/api/v1/Login', submitData);

      const { token, user } = response.data;

      // Save token and user data to AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });

      // Navigate to the home screen
      navigate('Home');

      return { token, user };
    } catch (error) {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.msg || 'Something went wrong!',
      });
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create the async thunk for user logout
export const logout = createAsyncThunk(
  'user/logout',
  async ({ navigate, dispatch }, { rejectWithValue }) => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      // Clear Redux state
      dispatch(clearUserData());

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Logout Successful',
        text2: 'You have been logged out.',
      });

      // Navigate to the Login screen
      navigate('Login');
    } catch (error) {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: error.response?.data?.msg || 'Something went wrong!',
      });
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create the slice
const registerSlice = createSlice({
  name: 'register',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserData: (state) => {
      state.user = null;
      state.token = null;
      // AsyncStorage.clear(); // Optional: Clear AsyncStorage for complete reset
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to register';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to log in';
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

// Export the action to clear user data
export const { clearUserData } = registerSlice.actions;

// Export the reducer
export default registerSlice.reducer;
