import { createSlice } from "@reduxjs/toolkit";

const initialUiState = { isShowCart: false };

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    toggleCart(state) {
      state.isShowCart = !state.isShowCart;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
