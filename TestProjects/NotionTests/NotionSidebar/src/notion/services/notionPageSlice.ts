import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import { CookieData, PageState, NavigationState } from './NotionPageTypes';
import * as blockApi from 'aNotion/api/v3/blockApi';
import * as LoadPageChunk from 'aNotion/typing/notionApi_V3/page';

const logPath = 'notion/page/';

const initialState: PageState = {
   cookie: { status: 'pending' },
   navigation: {},
   currentPage: { status: 'pending' },
};

const fetchCurrentPage = createAsyncThunk(
   logPath + 'current',
   async ({ pageId, limit }: any) => {
      return (await blockApi.loadPageChunk(
         pageId,
         limit
      )) as LoadPageChunk.PageChunk;
   }
);

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
      [fetchCurrentPage.fulfilled.toString()]: (state, action) => {
         state.currentPage = action.payload;
         state.currentPage.status = 'fulfilled';
      },
      [fetchCurrentPage.pending.toString()]: (state, action) => {
         state.currentPage.status = 'pending';
         state.currentPage.page = undefined;
      },
      [fetchCurrentPage.rejected.toString()]: (state, action) => {
         state.currentPage.status = 'rejected';
      },
   },
});

export const notionPageActions = {
   ...notionPageSlice.actions,
   fetchCurrentPage,
};
export const notionPageReducers = notionPageSlice.reducer;
