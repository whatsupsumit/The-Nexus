import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import themeReducer from "./themeSlice";

const appStore = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer,
    },
});

export default appStore;

//