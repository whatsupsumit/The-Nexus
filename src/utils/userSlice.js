import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        name: null,
    },
    reducers: {
        addUser: (state, action) => {
            state.name = action.payload;
        },
        removeUser: (state,action) => {
            state.name = null;
        },
    },
        
});

export const { addUser, removeUser } = userSlice.actions ;
export default userSlice.reducer;


    