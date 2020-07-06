import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import {
   CookieData,
   SiteState,
   NavigationState,
} from 'aNotion/components/NotionSiteTypes';
import * as blockApi from 'aNotion/api/v3/blockApi';
import * as LoadPageChunk from 'aNotion/typing/notionApi_V3/page';
import { thunkStatus } from 'aNotion/typing/thunkStatus';

const logPath = 'notion/page/';

const initialState: SiteState = {
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

const loadCookies: CaseReducer<SiteState, PayloadAction<CookieData>> = (
   state,
   action
) => {
   state.cookie.data = action.payload;
   state.cookie.status = thunkStatus.fulfilled;
};

const savePageId = {
   reducer: (state: SiteState, action: PayloadAction<NavigationState>) => {
      state.navigation = action.payload;
   },
   prepare: (payload: NavigationState) => ({ payload: payload }),
};

const notionSiteSlice = createSlice({
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
         console.log(state.currentPage.page.recordMap);
         //need to get the title
         //action.payload.recordMap.block[state.navigation.pageId!]
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

export const notionSiteActions = {
   ...notionSiteSlice.actions,
   fetchCurrentPage,
};
export const notionSiteReducers = notionSiteSlice.reducer;
