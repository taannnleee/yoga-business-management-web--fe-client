import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import categories from "./category";

export const reducer = combineReducers({
  auth,
  categories,
});
