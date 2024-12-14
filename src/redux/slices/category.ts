import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../../types/user";

export type IInputMode = "INPUT_OTP" | "INPUT_PHONE_NUMBER";
interface IInitialState {
  listCategory: IProductCategory[];
}

const initialState: IInitialState = {
  listCategory: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setListCategory: (state, actions: PayloadAction<IProductCategory[]>) => {
      state.listCategory = actions.payload;
    },
  },
});

export const { setListCategory } = categorySlice.actions;
export default categorySlice.reducer;
