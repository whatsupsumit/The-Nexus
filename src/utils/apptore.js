// Redux Toolkit - Redux store configuration ke liye
import { configureStore } from "@reduxjs/toolkit";
// User reducer - user ki state manage karta hai (login, logout, watch history)
import userReducer from "./userSlice";
// Theme reducer - app ki theme manage karta hai (dark/light mode)
import themeReducer from "./themeSlice";

// Main Redux store - puri app ki global state yahan stored hai
// User data aur theme settings yahan se access hote hain
const appStore = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer,
    },
});

export default appStore;

//