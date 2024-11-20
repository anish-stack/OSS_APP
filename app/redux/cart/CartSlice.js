import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const initialCartState = {
    cart: [],
    total: 0,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        setCart(state, action) {
            state.cart = action.payload.cart;
            state.total = action.payload.total;
        },
        addToCart(state, action) {
            const existingProductIndex = state.cart.findIndex(item => item._id === action.payload._id);

            if (existingProductIndex >= 0) {
                // Update quantity if product already exists
                state.cart[existingProductIndex].quantity += action.payload.quantity;
            } else {
                // Add new product
                state.cart.push(action.payload);
            }

            state.total += action.payload.afterDiscountPrice * action.payload.quantity; // Update total
            saveCartToStorage(state.cart, state.total); // Save to AsyncStorage
            Toast.show({
                type: 'success',
                text1: 'Added to Cart!',
                text2: `${action.payload.name} has been added.`,
            });
        },
        removeFromCart(state, action) {
            console.log(action.payload)
            const updatedCart = state.cart.filter(item => item._id !== action.payload.id);
            const removedItem = state.cart.find(item => item._id === action.payload.id);

            if (removedItem) {
                state.total -= removedItem.afterDiscountPrice * removedItem.quantity; // Update total
            }

            state.cart = updatedCart;
            saveCartToStorage(state.cart, state.total); // Save to AsyncStorage

            Toast.show({
                type: 'info',
                text1: 'Removed from Cart',
                text2: `${removedItem?.name} has been removed.`,
            });
        },
        updateQuantity(state, action) {
            const existingProductIndex = state.cart.findIndex(item => item._id === action.payload._id);

            if (existingProductIndex >= 0) {
                const existingItem = state.cart[existingProductIndex];
                const previousQuantity = existingItem.quantity;
                const newQuantity = action.payload.quantity;

                // Update total price
                state.total += (newQuantity - previousQuantity) * existingItem.afterDiscountPrice;
                state.cart[existingProductIndex].quantity = newQuantity;
                saveCartToStorage(state.cart, state.total);

                Toast.show({
                    type: 'info',
                    text1: 'Quantity Updated',
                    text2: `Quantity for ${existingItem.name} has been updated.`,
                });
            }
        },
        clearCart(state) {
            state.cart = [];
            state.total = 0;
            saveCartToStorage(state.cart, state.total); // Save to AsyncStorage

            Toast.show({
                type: 'info',
                text1: 'Cart Cleared',
                text2: 'All items have been removed from your cart.',
            });
        },
    },
});

// Save cart to AsyncStorage
const saveCartToStorage = async (cart, total) => {
    try {
        const data = JSON.stringify({ cart, total });
        await AsyncStorage.setItem('@cart', data);
    } catch (error) {
        console.error('Failed to save cart to AsyncStorage', error);
    }
};

// Load cart from AsyncStorage
export const loadCartFromStorage = () => async (dispatch) => {
    try {
        const data = await AsyncStorage.getItem('@cart');
        if (data) {
            const { cart, total } = JSON.parse(data);
            dispatch(setCart({ cart, total }));
        }
    } catch (error) {
        console.error('Failed to load cart from AsyncStorage', error);
    }
};

// Export actions for use in components
export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;

// Export reducer for store configuration
export default cartSlice.reducer;
