import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import * as referenceApi from 'aNotion/api/v3/referenceApi';
import { SearchSort } from 'aNotion/api/v3/apiRequestTypes';
import {
   ReferenceState,
   defaultPageReferences,
   PageReferences,
} from './referenceState';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   processSearchResults,
   processBacklinks,
   getRelationsForPage,
} from 'aNotion/services/referenceService';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { currentPageSelector } from 'aNotion/providers/storeSelectors';
import { RootState } from 'aNotion/providers/rootReducer';
import { Page } from 'aNotion/types/notionV3/notionBlockTypes';

const initialState: ReferenceState = {
   pageReferences: defaultPageReferences(),
   pageReferencesStatus: thunkStatus.idle,
   searchQueries: [],
};

const fetchRefsForPage = createAsyncThunk<
   PageReferences,
   { query: string; pageId: string }
>(
   'notion/reference/current',
   async ({ query, pageId }, thunkApi): Promise<PageReferences> => {
      //related seraches
      let searchPromise = searchApi.searchByRelevance(
         query,
         false,
         50,
         SearchSort.Relevance,
         thunkApi.signal
      );

      //get backlinks
      let linksPromise = referenceApi.getBacklinks(pageId, thunkApi.signal);

      //get page relations
      let relationsPromise: Promise<NotionBlockModel[]> = new Promise<
         NotionBlockModel[]
      >(() => []);
      let pageBlock = currentPageSelector(thunkApi.getState() as RootState)
         .currentPage?.pageBlock;
      if (pageBlock != null && pageBlock.block != null) {
         let page = pageBlock.block as Page;
         relationsPromise = getRelationsForPage(page, thunkApi.signal);
      }

      //resolve promises
      let search = await searchPromise;
      let links = await linksPromise;
      let relations = await relationsPromise;

      //construct result
      if (links != null && !thunkApi.signal.aborted && search != null) {
         const b = processBacklinks(links);
         const s = processSearchResults(
            query,
            search,
            pageId,
            b.map((b) => b.backlinkBlock.blockId)
         );
         return {
            backlinks: b,
            references: s,
            pageId: pageId,
            relations: relations,
         };
      }

      return defaultPageReferences();
   }
);

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state
) => {
   state.pageReferences = defaultPageReferences();
   state.pageReferencesStatus = thunkStatus.pending;
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
         state.pageReferencesStatus = thunkStatus.fulfilled;
      },
      [fetchRefsForPage.pending.toString()]: (state) => {
         state.pageReferencesStatus = thunkStatus.pending;
         state.pageReferences = defaultPageReferences();
      },
      [fetchRefsForPage.rejected.toString()]: (state) => {
         state.pageReferencesStatus = thunkStatus.rejected;
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
