// File: store/categorySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Category {
    id: number;
    name: string;
}

interface CategoryState {
    selectedCategory: Category | null;
    selectedSubCategory: Category | null;
}

const initialState: CategoryState = {
    selectedCategory: null,
    selectedSubCategory: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setSelectedCategory: (state, action: PayloadAction<Category>) => { // Category object as payload
            state.selectedCategory = action.payload;
            state.selectedSubCategory = null; // Reset subcategory when a new category is selected
        },
        setSelectedSubCategory: (state, action: PayloadAction<Category>) => { // Category object as payload
            state.selectedSubCategory = action.payload;
        },
    },
});

export const { setSelectedCategory, setSelectedSubCategory } = categorySlice.actions;
export default categorySlice.reducer;
