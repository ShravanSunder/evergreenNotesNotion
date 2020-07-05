import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import { CookieData, PageState, NavigationState } from './NotionPageTypes';
import * as blockApi from 'aNotion/api/v3/blockApi';
import * as LoadPageChunk from 'aNotion/typing/notionApi_V3/page';
import { thunkStatus } from 'aNotion/typing/thunkStatus';

const logPath = 'notion/page/';

const initialState: PageState = {
   cookie: { status: thunkStatus.pending },
   navigation: {},
   currentPage: { status: thunkStatus.pending },
};

type fetchCurrentPageRequest = { pageId: string; limit: number };
const fetchCurrentPage = createAsyncThunk(
   logPath + 'current',
   async ({ pageId, limit }: fetchCurrentPageRequest) => {
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
   state.cookie.status = thunkStatus.fulfilled;
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
      [fetchCurrentPage.fulfilled.toString()]: (
         state,
         action: PayloadAction<LoadPageChunk.PageChunk>
      ) => {
         state.currentPage.page = action.payload;
         state.currentPage.status = thunkStatus.fulfilled;
      },
      [fetchCurrentPage.pending.toString()]: (
         state,
         action: PayloadAction<LoadPageChunk.PageChunk>
      ) => {
         state.currentPage.status = thunkStatus.pending;
         state.currentPage.page = undefined;
      },
      [fetchCurrentPage.rejected.toString()]: (
         state,
         action: PayloadAction<LoadPageChunk.PageChunk>
      ) => {
         state.currentPage.status = thunkStatus.rejected;
      },
   },
});

export const notionPageActions = {
   ...notionPageSlice.actions,
   fetchCurrentPage,
};
export const notionPageReducers = notionPageSlice.reducer;