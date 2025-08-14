"use client";

import globalReducer from "@/state";
import { api } from "@/state/api";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector
} from "react-redux";

/* REDUX STORE */
export const rootReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware)
  });
};

// Export a singleton store instance and initialize listeners
export const store = makeStore();
setupListeners(store.dispatch);

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */
export default function StoreProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // Use the exported singleton store instead of creating a new one here
  return <Provider store={store}>{children}</Provider>;
}
