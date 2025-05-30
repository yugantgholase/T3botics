import { configureStore } from "@reduxjs/toolkit";
import botReducer from "../slices/botSlice";

const store = configureStore({
  reducer: {
    bot: botReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
