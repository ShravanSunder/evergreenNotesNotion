import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const logPath = 'notion/cookies/';

const saveCookieData = createAsyncThunk(
   `${logPath}/getStore`,
   async ({  }: any, { getState }) => {}
);

// Then, handle actions in your reducers:
const cookieSlice = createSlice({
   name: 'locations',
   initialState: { store: {} },
   reducers: {},
   extraReducers: {
      [saveCookieData.fulfilled.toString()]: (state, action) => {
         state.store = action.payload;
      },
      [saveCookieData.pending.toString()]: (state, action) => {
         state.store = {};
      },
      [saveCookieData.rejected.toString()]: (state, action) => {
         state.store = {};
      },
   },
});

export const cookieActions = { ...cookieSlice.actions, saveCookieData };
export const cookieReducers = {
   storeInfo: cookieSlice.reducer,
};
