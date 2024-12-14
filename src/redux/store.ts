// File: redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/cartSlice"; // Cart reducer (if you have one)
import categoryReducer from '../redux/category/categorySlice'; // Category reducer

// Create the store using configureStore
const store = configureStore({
    reducer: {
        cart: cartReducer, // Reducer for the cart state
        category: categoryReducer, // Reducer for the category state
    },
});

// Export the store
export default store;

// Types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
