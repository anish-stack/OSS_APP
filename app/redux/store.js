// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import registerReducer  from './authSlice/RegisterAndLogin';
import CartReducer  from './cart/CartSlice';


export const store = configureStore({
    reducer:{
        register: registerReducer,
        cart:CartReducer
    }
});

export default store;
