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
   PageRecordState,
} from 'aNotion/components/NotionSiteTypes';
import * as blockApi from 'aNotion/api/v3/blockApi';
import * as LoadPageChunk from 'aNotion/types/notionv3/notionRecordTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { getPageRecordFromChunk } from 'aNotion/services/blockService';
import { extractNavigationData } from 'aNotion/services/notionSiteService';
import { PageRecordModel } from 'aNotion/types/PageRecord';

const logPath = 'notion/page/';

const initialState: SiteState = {
   cookie: { status: thunkStatus.pending },
   navigation: {},
   currentPageRecord: { status: thunkStatus.pending },
};

type fetchCurrentPageRequest = { pageId: string; limit: number };
const fetchCurrentPage = createAsyncThunk(
   logPath + 'current',
   async ({ pageId, limit }: fetchCurrentPageRequest, thunkApi) => {
      let chunk = (await blockApi.loadPageChunk(
         pageId,
         limit
      )) as LoadPageChunk.PageChunk;

      thunkApi.dispatch(
         notionSiteSlice.actions.processChunkToBlock({ chunk, pageId })
      );
      return chunk;
   }
);

const loadCookies: CaseReducer<SiteState, PayloadAction<CookieData>> = (
   state,
   action
) => {
   state.cookie.data = action.payload;
   state.cookie.status = thunkStatus.fulfilled;
};

const currentPage = {
   reducer: (state: SiteState, action: PayloadAction<NavigationState>) => {
      state.navigation = action.payload;
   },
   prepare: (payload: string) => {
      let data = extractNavigationData(payload);
      return { payload: data };
   },
};

type processChunkToBlockType = {
   chunk: LoadPageChunk.PageChunk;
   pageId: string;
};
const processChunkToBlock = {
   reducer: (state: SiteState, action: PayloadAction<PageRecordModel>) => {
      state.currentPageRecord.pageRecord = action.payload;
   },
   prepare: (payload: processChunkToBlockType) => ({
      payload: getPageRecordFromChunk(payload.chunk, payload.pageId),
   }),
};

const notionSiteSlice = createSlice({
   name: 'locations',
   initialState: initialState,
   reducers: {
      loadCookies: loadCookies,
      currentPage: currentPage,
      processChunkToBlock: processChunkToBlock,
   },
   extraReducers: {
      [fetchCurrentPage.fulfilled.toString()]: (
         state,
         action: PayloadAction<LoadPageChunk.PageChunk>
      ) => {
         state.currentPageRecord.pageChunk = action.payload;
         state.currentPageRecord.status = thunkStatus.fulfilled;
      },
      [fetchCurrentPage.pending.toString()]: (
         state,
         action: PayloadAction<LoadPageChunk.PageChunk>
      ) => {
         state.currentPageRecord.status = thunkStatus.pending;
         state.currentPageRecord.pageRecord = undefined;
      },
      [fetchCurrentPage.rejected.toString()]: (
         state,
         action: PayloadAction<LoadPageChunk.PageChunk>
      ) => {
         state.currentPageRecord.status = thunkStatus.rejected;
      },
   },
});

export const notionSiteActions = {
   ...notionSiteSlice.actions,
   fetchCurrentPage,
};
export const notionSiteReducers = notionSiteSlice.reducer;
