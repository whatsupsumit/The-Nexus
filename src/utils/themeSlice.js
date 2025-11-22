// Redux Toolkit - Redux store ke liye
import { createSlice } from "@reduxjs/toolkit";

// Theme slice - app ki theme (dark/light mode) ko Redux mein manage karta hai
const themeSlice = createSlice({
    name: "theme",
    // Initial state - default dark mode se start hota hai
    initialState: {
        mode: "dark",
    },
    // Reducers - theme change karne ke actions
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "dark" ? "light" : "dark";
        },
        setTheme: (state, action) => {
            state.mode = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;