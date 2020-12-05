import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
   AnyAction,
   ThunkDispatch,
} from '@reduxjs/toolkit';
import {
   SidebarExtensionState,
   NavigationState,
} from 'aNotion/components/layout/SidebarExtensionState';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import * as blockService from 'aNotion/services/blockService';
import {
   calculateShouldUpdateStatus,
   extractNavigationData,
} from 'aNotion/services/notionSiteService';
import { pageMarkActions } from 'aNotion/components/pageMarks/pageMarksSlice';
import { ICurrentPageData } from 'aNotion/models/INotionPage';
import { mentionsActions } from 'aNotion/components/mentions/mentionsSlice';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { isGuid } from 'aCommon/extensionHelpers';
import { appDispatch } from 'aNotion/providers/appDispatch';
import { updateStatus } from 'aNotion/types/updateStatus';
import {
   currentPageSelector,
   referenceSelector,
   sidebarExtensionSelector,
} from 'aNotion/providers/storeSelectors';
import { NotionBlockRecord } from 'aNotion/models/NotionBlock';
import { Dispatch } from 'react';

const initialState: SidebarExtensionState = {
   navigation: {},
   currentNotionPage: { status: thunkStatus.idle, retryCounter: 0 },
   status: {
      notionWebpageLoadingStatus: thunkStatus.idle,
      updateReferences: updateStatus.waiting,
      updateMarks: updateStatus.waiting,
   },
};

const fetchCurrentNotionPage = createAsyncThunk<
   ICurrentPageData,
   { pageId: string }
>(
   'notion/page/current',
   async (
      { pageId }: { pageId: string },
      thunkApi
   ): Promise<ICurrentPageData> => {
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
            sidebarExtensionSlice.actions.setUpdateMarksStatus(
               updateStatus.updating
            )
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

         //get the first space id
         spaceId = Object.keys(chunk.recordMap.space)[0];

         updateReferencesIfPageTitleChanged(
            thunkApi.getState,
            thunkApi.dispatch,
            record
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
         sidebarExtensionSlice.actions.setUpdateMarksStatus(
            updateStatus.updateAborted
         )
      );
      thunkApi.dispatch(
         sidebarExtensionSlice.actions.setUpdateReferenceStatus(
            updateStatus.updateAborted
         )
      );
      return { pageBlock: undefined, spaceId: spaceId };
   }
);

const updateReferencesIfPageTitleChanged = (
   getState: any,
   dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
   record: NotionBlockRecord
) => {
   const oldPageTitle = referenceSelector(getState() as any).pageReferences
      .pageName;

   const statusState = sidebarExtensionSelector(getState() as any).status;

   if (
      calculateShouldUpdateStatus(statusState.updateReferences) ||
      oldPageTitle !== record.simpleTitle
   ) {
      dispatch(
         sidebarExtensionSlice.actions.setUpdateReferenceStatus(
            updateStatus.shouldUpdate
         )
      );
   }
};

const fetchCurrentNotionPageReducers = {
   [fetchCurrentNotionPage.fulfilled.toString()]: (
      state: SidebarExtensionState,
      action: PayloadAction<ICurrentPageData>
   ) => {
      state.currentNotionPage.currentPageData = action.payload;
      state.navigation.spaceId = action.payload?.spaceId;
      if (
         state.navigation.spaceId == null ||
         state.currentNotionPage.currentPageData.pageBlock?.block == null
      ) {
         state.currentNotionPage.status = thunkStatus.rejected;
      } else {
         state.currentNotionPage.status = thunkStatus.fulfilled;
         state.currentNotionPage.retryCounter = 0;
      }
   },
   [fetchCurrentNotionPage.pending.toString()]: (
      state: SidebarExtensionState,
      action: PayloadAction<ICurrentPageData>
   ) => {
      state.currentNotionPage.status = thunkStatus.pending;
      state.currentNotionPage.currentPageData = undefined;
   },
   [fetchCurrentNotionPage.rejected.toString()]: (
      state: SidebarExtensionState,
      action: PayloadAction<ICurrentPageData>
   ) => {
      state.currentNotionPage.status = thunkStatus.rejected;
      state.currentNotionPage.currentPageData = undefined;
      state.currentNotionPage.retryCounter += 1;
   },
};

const unloadPreviousPageReducer = (state: SidebarExtensionState) => {
   state.currentNotionPage.currentPageData = undefined;
   state.currentNotionPage.status = thunkStatus.idle;
   state.status.notionWebpageLoadingStatus = thunkStatus.idle;
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
            state.status.updateReferences = updateStatus.waiting;
            state.status.updateMarks = updateStatus.waiting;
         }
         state.status.notionWebpageLoadingStatus = thunkStatus.fulfilled;
      } else {
         unloadPreviousPageReducer(state);
         state.status.notionWebpageLoadingStatus = thunkStatus.rejected;
         state.status.updateReferences = updateStatus.waiting;
         state.status.updateMarks = updateStatus.waiting;
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
   return state;
};

const setUpdateMarksStatusReducer: CaseReducer<
   SidebarExtensionState,
   PayloadAction<updateStatus>
> = (state, action) => {
   state.status.updateMarks = action.payload;
   return state;
};

const sidebarExtensionSlice = createSlice({
   name: 'notionSiteSlice',
   initialState: initialState,
   reducers: {
      updateNavigationData: updateNavigationDataReducer,
      unloadPreviousPage: unloadPreviousPageReducer,
      setPageLoadingStatus: (state) => {
         state.status.notionWebpageLoadingStatus = thunkStatus.pending;
      },
      setPageCompletedStatus: (state) => {
         state.status.notionWebpageLoadingStatus = thunkStatus.fulfilled;
      },
      setUpdateReferenceStatus: setUpdateReferenceStatusReducer,
      setUpdateMarksStatus: setUpdateMarksStatusReducer,
   },
   extraReducers: { ...fetchCurrentNotionPageReducers },
});

export const sidebarExtensionActions = {
   ...sidebarExtensionSlice.actions,
   fetchCurrentNotionPage: fetchCurrentNotionPage,
};
export const sidebarExtensionReducers = sidebarExtensionSlice.reducer;
