import { combineReducers, configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import categories from "./slices/category";

const rootReducer = combineReducers({
  auth: auth,
  categories: categories,
}) as any;

export default rootReducer;
