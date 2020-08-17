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
} from 'aNotion/components/layout/NotionSiteTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import * as blockService from 'aNotion/services/blockService';
import { extractNavigationData } from 'aNotion/services/notionSiteService';
import {
   NotionBlockModel,
   NotionBlockRecord,
} from 'aNotion/models/NotionBlock';
import { appDispatch } from 'aNotion/providers/reduxStore';
import { pageMarkActions } from 'aNotion/components/pageMarks/pageMarksSlice';

const initialState: SiteState = {
   cookie: { status: thunkStatus.pending },
   navigation: {},
   currentPageRecord: { status: thunkStatus.pending },
};

const fetchCurrentPage = createAsyncThunk<
   NotionBlockModel | undefined,
   { pageId: string }
>(
   'notion/page/current',
   async (
      { pageId }: { pageId: string },
      thunkApi
   ): Promise<NotionBlockModel | undefined> => {
      let record = await blockService.fetchPageRecord(pageId, thunkApi.signal);
      appDispatch(pageMarkActions.processPageForMarks({ pageId, record }));
      return record?.toSerializable();
   }
);

const loadCookies: CaseReducer<SiteState, PayloadAction<CookieData>> = (
   state,
   action
) => {
   if (
      state.cookie.status !== thunkStatus.fulfilled ||
      state.cookie.data == null ||
      state.cookie.data.userId == null ||
      state.cookie.data?.spaceId == null ||
      state.cookie.data?.token == null
   ) {
      state.cookie.data = action.payload;
      state.cookie.status = thunkStatus.fulfilled;
   }
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

const notionSiteSlice = createSlice({
   name: 'notionSiteSlice',
   initialState: initialState,
   reducers: {
      loadCookies: loadCookies,
      currentPage: currentPage,
   },
   extraReducers: {
      [fetchCurrentPage.fulfilled.toString()]: (
         state,
         action: PayloadAction<NotionBlockModel>
      ) => {
         state.currentPageRecord.pageRecord = action.payload;
         state.currentPageRecord.status = thunkStatus.fulfilled;
      },
      [fetchCurrentPage.pending.toString()]: (
         state,
         action: PayloadAction<NotionBlockModel>
      ) => {
         state.currentPageRecord.status = thunkStatus.pending;
         state.currentPageRecord.pageRecord = undefined;
      },
      [fetchCurrentPage.rejected.toString()]: (
         state,
         action: PayloadAction<NotionBlockModel>
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
