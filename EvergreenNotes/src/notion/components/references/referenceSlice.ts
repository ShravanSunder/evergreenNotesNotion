import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import * as referenceApi from 'aNotion/api/v3/referenceApi';
import {
   BacklinkRecordType,
   SearchResultsType,
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
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

const initialState: ReferenceState = {
   pageReferences: defaultPageReferences(),
   status: thunkStatus.idle,
   //this is a history of search queries, should be moved
   searchQueries: [],
};

const fetchRefsForPage = createAsyncThunk<
   PageReferences,
   { query: string; pageId: string }
>(
   'notion/reference/current',
   async ({ query, pageId }, thunkApi): Promise<PageReferences> => {
      //resolve promises
      let search: SearchResultsType | undefined = undefined;
      let links: BacklinkRecordType | undefined = undefined;
      let relations: NotionBlockModel[] | undefined = undefined;

      let spaceId = currentPageSelector(thunkApi.getState() as RootState)
         .currentPageData?.spaceId;

      try {
         //get backlinks
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

      //construct result
      // allows it to partially succeed
      if (!thunkApi.signal.aborted) {
         let b: BacklinkRecordModel[] = [];
         if (links != null) {
            const b = processBacklinks(links);
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
         return {
            backlinks: b,
            references: s,
            pageId: pageId,
            relations: relations ?? [],
         };
      }

      return defaultPageReferences();
   }
);

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state
) => {
   state.pageReferences = defaultPageReferences();
   state.status = thunkStatus.idle;
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
};

const referenceSlice = createSlice({
   name: 'referenceSlice',
   initialState: initialState,
   reducers: {
      unloadReferences: unloadReferences,
      addSearchQueries: addSearchQueries,
   },
   extraReducers: {
      [fetchRefsForPage.fulfilled.toString()]: (
         state,
         action: PayloadAction<PageReferences>
      ) => {
         state.pageReferences = action.payload;
         state.status = thunkStatus.fulfilled;
      },
      [fetchRefsForPage.pending.toString()]: (state) => {
         state.status = thunkStatus.pending;
         state.pageReferences = defaultPageReferences();
      },
      [fetchRefsForPage.rejected.toString()]: (state) => {
         state.status = thunkStatus.rejected;
         state.pageReferences = defaultPageReferences();
      },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchRefsForPage: fetchRefsForPage,
   //fetchSearchResults: fetchSearchResults,
   //processTitleRefs,
};
export const referenceReducers = referenceSlice.reducer;
