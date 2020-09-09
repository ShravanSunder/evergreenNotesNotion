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
} from 'aNotion/components/layout/NotionSiteState';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import * as blockService from 'aNotion/services/blockService';
import { extractNavigationData } from 'aNotion/services/notionSiteService';
import { pageMarkActions } from 'aNotion/components/pageMarks/pageMarksSlice';
import { CurrentPage } from 'aNotion/models/NotionPage';
import { mentionsActions } from 'aNotion/components/mentions/mentionsSlice';

const initialState: SiteState = {
   cookie: { status: thunkStatus.pending },
   navigation: {},
   currentPage: { status: thunkStatus.pending },
};

const fetchCurrentPage = createAsyncThunk<
   CurrentPage | undefined,
   { pageId: string }
>(
   'notion/page/current',
   async (
      { pageId }: { pageId: string },
      thunkApi
   ): Promise<CurrentPage | undefined> => {
      const [record, chunk] = await blockService.fetchPageRecord(
         pageId,
         thunkApi.signal
      );

      thunkApi.dispatch(
         pageMarkActions.processPageForMarks({
            pageId,
            record,
            signal: thunkApi.signal,
         })
      );

      thunkApi.dispatch(
         mentionsActions.saveAllUsers(chunk.recordMap.notion_user)
      );

      //get the first key
      const spaceId = Object.keys(chunk.recordMap.space)[0];

      return {
         record: record?.toSerializable(),
         spaceId: spaceId,
      };
   }
);

const loadCookies: CaseReducer<SiteState, PayloadAction<CookieData>> = (
   state,
   action
) => {
   if (
      state.cookie.status !== thunkStatus.fulfilled ||
      state.cookie.data == null ||
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
         action: PayloadAction<CurrentPage>
      ) => {
         state.currentPage.currentPage = action.payload;
         state.currentPage.status = thunkStatus.fulfilled;
      },
      [fetchCurrentPage.pending.toString()]: (
         state,
         action: PayloadAction<CurrentPage>
      ) => {
         state.currentPage.status = thunkStatus.pending;
         state.currentPage.currentPage = undefined;
      },
      [fetchCurrentPage.rejected.toString()]: (
         state,
         action: PayloadAction<CurrentPage>
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
