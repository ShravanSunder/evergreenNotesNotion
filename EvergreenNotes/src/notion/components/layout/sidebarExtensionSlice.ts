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
import { updateStatus } from 'aNotion/types/updateStatus';

const initialState: SidebarExtensionState = {
   cookie: { status: thunkStatus.idle },
   navigation: {},
   currentNotionPage: { status: thunkStatus.idle },
   status: {
      webpageStatus: thunkStatus.idle,
      updateReferences: updateStatus.waiting,
      updateMarks: updateStatus.waiting,
   },
};

const fetchCurrentNotionPage = createAsyncThunk<
   CurrentPageData,
   { pageId: string }
>(
   'notion/page/current',
   async (
      { pageId }: { pageId: string },
      thunkApi
   ): Promise<CurrentPageData> => {
      thunkApi.dispatch(
         sidebarExtensionSlice.actions.setUpdateReferenceStatus(
            updateStatus.waiting
         )
      );

      let spaceId: string | undefined = undefined;
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
         spaceId = Object.keys(chunk.recordMap.space)[0];

         thunkApi.dispatch(
            sidebarExtensionSlice.actions.setUpdateReferenceStatus(
               updateStatus.shouldUpdate
            )
         );
         return {
            pageBlock: record?.toSerializable(),
            spaceId: spaceId,
         };
      } else if (pageId != null && isGuid(pageId) && !thunkApi.signal.aborted) {
         thunkApi.dispatch(fetchCurrentNotionPage({ pageId }));
      } else if (chunk?.recordMap?.space != null) {
         spaceId = Object.keys(chunk.recordMap.space)[0];
      }

      thunkApi.dispatch(
         sidebarExtensionSlice.actions.setUpdateReferenceStatus(
            updateStatus.updateAborted
         )
      );
      return { pageBlock: undefined, spaceId: spaceId };
   }
);

const fetchCurrentNotionPageReducers = {
   [fetchCurrentNotionPage.fulfilled.toString()]: (
      state: SidebarExtensionState,
      action: PayloadAction<CurrentPageData>
   ) => {
      state.currentNotionPage.currentPageData = action.payload;
      state.navigation.spaceId = action.payload?.spaceId;
      state.currentNotionPage.status = thunkStatus.fulfilled;
   },
   [fetchCurrentNotionPage.pending.toString()]: (
      state: SidebarExtensionState,
      action: PayloadAction<CurrentPageData>
   ) => {
      state.currentNotionPage.status = thunkStatus.pending;
      state.currentNotionPage.currentPageData = undefined;
   },
   [fetchCurrentNotionPage.rejected.toString()]: (
      state: SidebarExtensionState,
      action: PayloadAction<CurrentPageData>
   ) => {
      state.currentNotionPage.status = thunkStatus.rejected;
      state.currentNotionPage.currentPageData = undefined;
   },
};

const unloadPreviousPageReducer = (state: SidebarExtensionState) => {
   state.currentNotionPage.currentPageData = undefined;
   state.currentNotionPage.status = thunkStatus.idle;
   state.status.webpageStatus = thunkStatus.idle;
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
            state.status.updateReferences = updateStatus.shouldUpdate;
         }
      } else {
         unloadPreviousPageReducer(state);
         state.status.webpageStatus = thunkStatus.rejected;
         state.status.updateReferences = updateStatus.waiting;
      }
   },
   prepare: (payload: string) => {
      let data = extractNavigationData(payload);
      return { payload: data };
   },
};

const setUpdateReferenceStatusReducer: CaseReducer<
   SidebarExtensionState,
   PayloadAction<updateStatus>
> = (state, action) => {
   state.status.updateReferences = action.payload;
};

const sidebarExtensionSlice = createSlice({
   name: 'notionSiteSlice',
   initialState: initialState,
   reducers: {
      loadCookies: loadCookiesReducer,
      updateNavigationData: updateNavigationDataReducer,
      unloadPreviousPage: unloadPreviousPageReducer,
      setPageLoadingStatus: (state) => {
         state.status.webpageStatus = thunkStatus.pending;
      },
      setPageCompletedStatus: (state) => {
         state.status.webpageStatus = thunkStatus.fulfilled;
      },
      setUpdateReferenceStatus: setUpdateReferenceStatusReducer,
   },
   extraReducers: { ...fetchCurrentNotionPageReducers },
});

export const sidebarExtensionActions = {
   ...sidebarExtensionSlice.actions,
   fetchCurrentNotionPage: fetchCurrentNotionPage,
};
export const sidebarExtensionReducers = sidebarExtensionSlice.reducer;
