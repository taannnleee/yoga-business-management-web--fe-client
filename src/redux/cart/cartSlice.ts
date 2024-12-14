// src/store/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";

// Initial state có totalItems
const initialState = {
    totalItems: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setTotalItems: (state, action) => {
            state.totalItems = action.payload; // Cập nhật totalItems với giá trị mới
        },
        incrementTotalItems: (state) => {
            state.totalItems += 1; // Tăng giá trị totalItems lên 1 mỗi khi gọi
        },
    },
});

export const { setTotalItems, incrementTotalItems } = cartSlice.actions;
export default cartSlice.reducer;
