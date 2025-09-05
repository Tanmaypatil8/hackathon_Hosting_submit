import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import hackathonReducer from "./slices/hackathonSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    hackathon: hackathonReducer,
  },
});

export default store;
