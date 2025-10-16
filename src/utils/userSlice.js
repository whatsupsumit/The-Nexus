import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        uid: null,
        name: null,
        email: null,
        displayName: null,
        recentlyWatched: [],
    },
    reducers: {
        addUser: (state, action) => {
            state.uid = action.payload.uid;
            state.name = action.payload.name || action.payload.displayName;
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
        },
        removeUser: (state, action) => {
            state.uid = null;
            state.name = null;
            state.email = null;
            state.displayName = null;
            state.recentlyWatched = [];
        },
        addWatchedItem: (state, action) => {
            const newItem = action.payload;
            // Check if item already exists (by id and media_type)
            const existingIndex = state.recentlyWatched.findIndex(
                item => item.id === newItem.id && item.media_type === newItem.media_type
            );
            if (existingIndex >= 0) {
                // Move to front
                state.recentlyWatched.splice(existingIndex, 1);
            }
            // Add to front
            state.recentlyWatched.unshift(newItem);
            // Keep only last 5
            if (state.recentlyWatched.length > 5) {
                state.recentlyWatched = state.recentlyWatched.slice(0, 5);
            }
        },
    },

});

export const { addUser, removeUser, addWatchedItem } = userSlice.actions ;
export default userSlice.reducer;