import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers";
import storage from "redux-persist/lib/storage";
import createFilter from "redux-persist-transform-filter";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const saveSubsetAuthReducer = createFilter("auth", [
  "accessToken",
  "user",
  "tokenExpiredTime",
]);

const persistConfig = {
  key: "root",
  storage,
  transforms: [saveSubsetAuthReducer],
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

let persistor = persistStore(store);

export type IRootState = ReturnType<typeof store.getState>;
export type IStoreDispatch = typeof store.dispatch;

export { store, persistor };
