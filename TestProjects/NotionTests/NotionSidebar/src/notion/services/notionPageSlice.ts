import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import {
   CookieData,
   PageState,
   CookieState,
   NavigationState,
} from './NotionPageTypes';

const logPath = 'notion/cookies/';

const initialState: PageState = {
   cookie: { status: 'pending' },
   navigation: {},
};

const loadCookies: CaseReducer<PageState, PayloadAction<CookieData>> = (
   state,
   action
) => {
   state.cookie.data = action.payload;
   state.cookie.status = 'fulfilled';
};

const savePageId = {
   reducer: (state: PageState, action: PayloadAction<NavigationState>) => {
      state.navigation = action.payload;
   },
   prepare: (payload: NavigationState) => ({ payload: payload }),
};

const notionPageSlice = createSlice({
   name: 'locations',
   initialState: initialState,
   reducers: {
      loadCookies: loadCookies,
      savePageId: savePageId,
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

export const notionPageActions = { ...notionPageSlice.actions };
export const notionPageReducers = notionPageSlice.reducer;
