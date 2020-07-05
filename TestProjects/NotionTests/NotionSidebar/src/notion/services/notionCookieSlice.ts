import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import { CookieData, CookieState } from './NotionCookieTypes';

const logPath = 'notion/cookies/';

const initialState: CookieState = { status: 'pending', data: null };
const loadCookies: CaseReducer<CookieState, PayloadAction<CookieData>> = (
   state,
   action
) => {
   state.data = action.payload;
   state.status = 'fulfilled';
};

// Then, handle actions in your reducers:
const notionCookieSlice = createSlice({
   name: 'locations',
   initialState: initialState,
   reducers: {
      loadCookies: loadCookies,
   },
   extraReducers: {
      // [saveCookieData.fulfilled.toString()]: (state, action) => {
      //    state.store = action.payload;
      // },
      // [saveCookieData.pending.toString()]: (state, action) => {
      //    state.store = {};
      // },
      // [saveCookieData.rejected.toString()]: (state, action) => {
      //    state.store = {};
      // },
   },
});

export const notionCookieActions = { ...notionCookieSlice.actions };
export const notionCookieReducers = notionCookieSlice.reducer;
