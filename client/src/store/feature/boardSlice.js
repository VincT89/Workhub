import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    lowStockProducts: [], 
    boardPosts: [],

}

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        setLowStockProducts: (state, action) => {
           state.lowStockProducts = action.payload;
        },
        setBoardPosts: (state, action) => {
            state.boardPosts = action.payload;
        },
    }
});

export const { setLowStockProducts, setBoardPosts } = boardSlice.actions;
export default boardSlice.reducer;  // reducer da inserire nello store.