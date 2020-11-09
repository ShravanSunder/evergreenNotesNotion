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
import { CurrentPageData } from 'aNotion/models/NotionPage';
import { mentionsActions } from 'aNotion/components/mentions/mentionsSlice';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';

const initialState: SiteState = {
   cookie: { status: thunkStatus.pending },
   navigation: {},
   currentPage: { status: thunkStatus.idle },
};

const fetchCurrentPage = createAsyncThunk<
   CurrentPageData | undefined,
   { pageId: string }
>(
   'notion/page/current',
   async (
      { pageId }: { pageId: string },
      thunkApi
   ): Promise<CurrentPageData | undefined> => {
      const [record, chunk] = await blockService.fetchPageRecord(
         pageId,
         thunkApi.signal
      );

      if (
         record != null &&
         record.type !== BlockTypeEnum.Unknown &&
         chunk != null
      ) {
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
            pageBlock: record?.toSerializable(),
            spaceId: spaceId,
         };
      } else if (pageId != null && !thunkApi.signal.aborted) {
         thunkApi.dispatch(fetchCurrentPage({ pageId }));
      }

      return undefined;
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

const updateNavigationData = {
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
      updateNavigationData: updateNavigationData,
   },
   extraReducers: {
      [fetchCurrentPage.fulfilled.toString()]: (
         state,
         action: PayloadAction<CurrentPageData>
      ) => {
         state.currentPage.currentPageData = action.payload;
         state.currentPage.status = thunkStatus.fulfilled;
         console.log('currentPage thunk:' + state.currentPage.status);
      },
      [fetchCurrentPage.pending.toString()]: (
         state,
         action: PayloadAction<CurrentPageData>
      ) => {
         state.currentPage.status = thunkStatus.pending;
         state.currentPage.currentPageData = undefined;
         console.log('currentPage thunk:' + state.currentPage.status);
      },
      [fetchCurrentPage.rejected.toString()]: (
         state,
         action: PayloadAction<CurrentPageData>
      ) => {
         state.currentPage.status = thunkStatus.rejected;
         console.log('currentPage thunk:' + state.currentPage.status);
      },
   },
});

export const notionSiteActions = {
   ...notionSiteSlice.actions,
   fetchCurrentPage,
};
export const notionSiteReducers = notionSiteSlice.reducer;
