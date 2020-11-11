import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import {
   CookieData,
   SidebarExtensionState,
   NavigationState,
} from 'aNotion/components/layout/SidebarExtensionState';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import * as blockService from 'aNotion/services/blockService';
import { extractNavigationData } from 'aNotion/services/notionSiteService';
import { pageMarkActions } from 'aNotion/components/pageMarks/pageMarksSlice';
import { CurrentPageData } from 'aNotion/models/NotionPage';
import { mentionsActions } from 'aNotion/components/mentions/mentionsSlice';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { isGuid } from 'aCommon/extensionHelpers';
import { appDispatch } from 'aNotion/providers/appDispatch';

const initialState: SidebarExtensionState = {
   cookie: { status: thunkStatus.idle },
   navigation: {},
   currentNotionPage: { status: thunkStatus.idle },
   sidebarStatus: {
      webpageStatus: thunkStatus.idle,
      updateReferences: true,
      updateMarks: true,
   },
};

const fetchCurrentNotionPage = createAsyncThunk<
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
         //get the first space id
         const spaceId = Object.keys(chunk.recordMap.space)[0];
         return {
            pageBlock: record?.toSerializable(),
            spaceId: spaceId,
         };
      } else if (pageId != null && isGuid(pageId) && !thunkApi.signal.aborted) {
         thunkApi.dispatch(fetchCurrentNotionPage({ pageId }));
      } else if (chunk?.recordMap?.space != null) {
         const spaceId = Object.keys(chunk.recordMap.space)[0];
         return { pageBlock: undefined, spaceId };
      }

      return undefined;
   }
);

const unloadPreviousPage = (state: SidebarExtensionState) => {
   state.currentNotionPage.currentPageData = undefined;
   state.currentNotionPage.status = thunkStatus.idle;
   state.sidebarStatus.webpageStatus = thunkStatus.rejected;
};

const loadCookiesReducer: CaseReducer<
   SidebarExtensionState,
   PayloadAction<CookieData>
> = (state, action) => {
   if (
      state.cookie.status !== thunkStatus.fulfilled ||
      state.cookie.data == null ||
      state.cookie.data?.token == null
   ) {
      state.cookie.data = action.payload;
      state.cookie.status = thunkStatus.fulfilled;
   }
};

const updateNavigationDataReducer = {
   reducer: (
      state: SidebarExtensionState,
      action: PayloadAction<NavigationState>
   ) => {
      const oldPageId = state.navigation.pageId;
      state.navigation = action.payload;
      if (
         state.navigation.pageId != null &&
         isGuid(state.navigation.pageId) &&
         state.navigation.url != null
      ) {
         if (state.navigation.pageId != oldPageId) {
            state.sidebarStatus.updateReferences = true;
         }

         appDispatch(
            fetchCurrentNotionPage({ pageId: state.navigation.pageId })
         );
      } else {
         unloadPreviousPage(state);
      }
   },
   prepare: (payload: string) => {
      let data = extractNavigationData(payload);
      return { payload: data };
   },
};

const sidebarExtensionSlice = createSlice({
   name: 'notionSiteSlice',
   initialState: initialState,
   reducers: {
      loadCookies: loadCookiesReducer,
      updateNavigationData: updateNavigationDataReducer,
      unloadPreviousPage: unloadPreviousPage,
      setPageLoadingStatus: (state) => {
         state.sidebarStatus.webpageStatus = thunkStatus.pending;
      },
      setPageCompletedStatus: (state) => {
         state.sidebarStatus.webpageStatus = thunkStatus.fulfilled;
      },
   },
   extraReducers: {
      [fetchCurrentNotionPage.fulfilled.toString()]: (
         state,
         action: PayloadAction<CurrentPageData>
      ) => {
         state.currentNotionPage.currentPageData = action.payload;
         state.navigation.spaceId = action.payload?.spaceId;
         state.currentNotionPage.status = thunkStatus.fulfilled;
      },
      [fetchCurrentNotionPage.pending.toString()]: (
         state,
         action: PayloadAction<CurrentPageData>
      ) => {
         state.currentNotionPage.status = thunkStatus.pending;
         state.currentNotionPage.currentPageData = undefined;
      },
      [fetchCurrentNotionPage.rejected.toString()]: (
         state,
         action: PayloadAction<CurrentPageData>
      ) => {
         state.currentNotionPage.status = thunkStatus.rejected;
         state.currentNotionPage.currentPageData = undefined;
      },
   },
});

export const sidebarExtensionActions = {
   ...sidebarExtensionSlice.actions,
   fetchCurrentNotionPage: fetchCurrentNotionPage,
};
export const sidebarExtensionReducers = sidebarExtensionSlice.reducer;
