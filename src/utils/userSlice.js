import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        uid: null,
        name: null,
        email: null,
        displayName: null,
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
        },
    },
        
});

export const { addUser, removeUser } = userSlice.actions ;
export default userSlice.reducer;