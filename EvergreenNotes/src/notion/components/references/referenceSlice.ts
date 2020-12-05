import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import * as referenceApi from 'aNotion/api/v3/referenceApi';
import {
   IBacklinkRecordType,
   ISearchResultsType,
   SearchSort,
} from 'aNotion/api/v3/apiRequestTypes';
import {
   ReferenceState,
   defaultPageReferences,
   PageReferences,
   defaultSearchReferences,
   BacklinkRecordModel,
   SearchReferences,
} from 'aNotion/components/references/referenceState';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   processSearchResults,
   processBacklinks,
   getRelationsForPage,
} from 'aNotion/services/referenceService';
import { currentPageSelector } from 'aNotion/providers/storeSelectors';
import { RootState } from 'aNotion/providers/rootReducer';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { sidebarExtensionActions } from 'aNotion/components/layout/sidebarExtensionSlice';
import { updateStatus } from 'aNotion/types/updateStatus';

const initialState: ReferenceState = {
   pageReferences: defaultPageReferences(),
   status: thunkStatus.idle,
   //this is a history of search queries, should be moved
   searchQueries: [],
};

const requestReferenceData = async (
   pageId: string,
   thunkApi: any,
   spaceId: string | undefined,
   search: ISearchResultsType | undefined,
   query: string,
   links: IBacklinkRecordType | undefined,
   relations: INotionBlockModel[] | undefined
) => {
   try {
      let linksPromise = referenceApi.getBacklinks(pageId, thunkApi.signal);
      //get page relations
      let pageBlock = currentPageSelector(thunkApi.getState() as RootState)
         .currentPageData?.pageBlock;
      let relationsPromise = getRelationsForPage(pageBlock, thunkApi.signal);

      //related seraches
      if (spaceId != null) {
         search = await searchApi.searchByRelevance(
            query,
            spaceId,
            false,
            50,
            SearchSort.Relevance,
            thunkApi.signal
         );
      }
      links = await linksPromise;
      relations = await relationsPromise;
   } catch {
      //don't worry about api errorrs as they are handled below with empty results
   }
   return { search, links, relations };
};

const processReferenceData = (
   links: IBacklinkRecordType | undefined,
   search: ISearchResultsType | undefined,
   query: string,
   pageId: string,
   thunkApi: any,
   relations: INotionBlockModel[] | undefined
) => {
   let b: BacklinkRecordModel[] = [];
   if (links != null) {
      b = processBacklinks(links);
   }
   let s: SearchReferences = defaultSearchReferences();
   if (search != null) {
      s = processSearchResults(
         query,
         search,
         pageId,
         b.map((b) => b.backlinkBlock.blockId),
         10
      );
   }

   thunkApi.dispatch(
      sidebarExtensionActions.setUpdateReferenceStatus(
         updateStatus.updateSuccessful
      )
   );

   return {
      backlinks: b,
      references: s,
      pageId: pageId,
      relations: relations ?? [],
      pageName: query,
   };
};

const fetchRefsForPage = createAsyncThunk<
   PageReferences,
   { query: string; pageId: string }
>(
   'notion/reference/fetchRefsForPage',
   async ({ query, pageId }, thunkApi): Promise<PageReferences> => {
      //resolve promises
      let search: ISearchResultsType | undefined = undefined;
      let links: IBacklinkRecordType | undefined = undefined;
      let relations: INotionBlockModel[] | undefined = undefined;

      thunkApi.dispatch(
         sidebarExtensionActions.setUpdateReferenceStatus(updateStatus.updating)
      );

      let spaceId = currentPageSelector(thunkApi.getState() as RootState)
         .currentPageData?.spaceId;

      ({ search, links, relations } = await requestReferenceData(
         pageId,
         thunkApi,
         spaceId,
         search,
         query,
         links,
         relations
      ));

      // allows it to partially succeed
      if (!thunkApi.signal.aborted) {
         return processReferenceData(
            links,
            search,
            query,
            pageId,
            thunkApi,
            relations
         );
      }

      //return default data if unsucessfull
      thunkApi.dispatch(
         sidebarExtensionActions.setUpdateReferenceStatus(
            updateStatus.updateFailed
         )
      );
      return defaultPageReferences();
   }
);
const fetchRefsForPageReducers = {
   [fetchRefsForPage.fulfilled.toString()]: (
      state: ReferenceState,
      action: PayloadAction<PageReferences>
   ) => {
      state.pageReferences = action.payload;
      state.status = thunkStatus.fulfilled;
   },
   [fetchRefsForPage.pending.toString()]: (state: ReferenceState) => {
      state.status = thunkStatus.pending;
      state.pageReferences = defaultPageReferences();
   },
   [fetchRefsForPage.rejected.toString()]: (state: ReferenceState) => {
      state.status = thunkStatus.rejected;
      state.pageReferences = defaultPageReferences();
   },
};

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state
) => {
   state.pageReferences = defaultPageReferences();
   state.status = thunkStatus.idle;
   return state;
};

const addSearchQueries: CaseReducer<ReferenceState, PayloadAction<string>> = (
   state,
   action
) => {
   let text = action.payload.trim();
   state.searchQueries = state.searchQueries.filter(
      (f, i) => i < 10 && f !== text
   );
   state.searchQueries.splice(0, 0, text);
   return state;
};

const referenceSlice = createSlice({
   name: 'referenceSlice',
   initialState: initialState,
   reducers: {
      unloadReferences: unloadReferences,
      addSearchQueries: addSearchQueries,
   },
   extraReducers: {
      ...fetchRefsForPageReducers,
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchRefsForPage: fetchRefsForPage,
};
export const referenceReducers = referenceSlice.reducer;
