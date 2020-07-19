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
import * as LoadPageChunk from 'aNotion/types/notionv3/notionRecordTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { getBlockFromPageChunk } from 'aNotion/services/blockService';
import { extractNavigationData } from 'aNotion/services/notionSiteService';
import { NotionBlockModel } from 'aNotion/types/NotionBlock';

const initialState: SiteState = {
   cookie: { status: thunkStatus.pending },
   navigation: {},
   currentPageRecord: { status: thunkStatus.pending },
};

type fetchCurrentPageRequest = { pageId: string; limit: number };
const fetchCurrentPage = createAsyncThunk(
   'notion/page/current',
   async ({ pageId, limit }: fetchCurrentPageRequest, thunkApi) => {
      let chunk = (await blockApi.loadPageChunk(
         pageId,
         limit,
         thunkApi.signal
      )) as LoadPageChunk.PageChunk;

      if (chunk != null) {
         thunkApi.dispatch(
            notionSiteSlice.actions.processChunkToBlock({ chunk, pageId })
         );
      }
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
   reducer: (state: SiteState, action: PayloadAction<NotionBlockModel>) => {
      state.currentPageRecord.pageRecord = action.payload;
   },
   prepare: (payload: processChunkToBlockType) => ({
      payload: getBlockFromPageChunk(payload.chunk, payload.pageId),
   }),
};

const notionSiteSlice = createSlice({
   name: 'notionSiteSlice',
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
