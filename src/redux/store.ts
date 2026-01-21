import { configureStore } from "@reduxjs/toolkit";
import { rtkQApi } from "./rtkQApi";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    [rtkQApi.reducerPath]: rtkQApi.reducer,
    auth: authReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQApi.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
