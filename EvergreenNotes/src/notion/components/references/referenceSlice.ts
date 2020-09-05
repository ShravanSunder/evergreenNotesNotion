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
   SearchReferences,
   defaultReferences,
} from './referenceState';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { createReferences } from 'aNotion/services/referenceService';

const initialState: ReferenceState = {
   pageReferences: defaultReferences(),
   pageReferencesStatus: thunkStatus.idle,
   searchQueries: [],
};

const fetchRefsForPage = createAsyncThunk<
   SearchReferences,
   { query: string; pageId: string }
>(
   'notion/reference/current',
   async ({ query, pageId }, thunkApi): Promise<SearchReferences> => {
      let searchPromise = searchApi.searchByRelevance(
         query,
         false,
         50,
         SearchSort.Relevance,
         thunkApi.signal
      );

      let links = await referenceApi.getBacklinks(pageId, thunkApi.signal);
      let search = await searchPromise;

      if (search != null && !thunkApi.signal.aborted) {
         return createReferences(query, search, pageId);
      }

      return defaultReferences();
   }
);

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state
) => {
   state.pageReferences = defaultReferences();
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
         action: PayloadAction<SearchReferences>
      ) => {
         state.pageReferences = action.payload;
         state.pageReferencesStatus = thunkStatus.fulfilled;
      },
      [fetchRefsForPage.pending.toString()]: (state) => {
         state.pageReferencesStatus = thunkStatus.pending;
         state.pageReferences = defaultReferences();
      },
      [fetchRefsForPage.rejected.toString()]: (state) => {
         state.pageReferencesStatus = thunkStatus.rejected;
         state.pageReferences = defaultReferences();
      },
      // [fetchSearchResults.fulfilled.toString()]: (
      //    state,
      //    action: PayloadAction<SearchReferences>
      // ) => {
      //    state.searchResults = action.payload;
      //    state.searchResultsStatus = thunkStatus.fulfilled;
      // },
      // [fetchSearchResults.pending.toString()]: (state) => {
      //    state.searchResultsStatus = thunkStatus.pending;
      //    state.searchResults = defaultReferences();
      // },
      // [fetchSearchResults.rejected.toString()]: (state) => {
      //    state.searchResultsStatus = thunkStatus.rejected;
      //    state.searchResults = defaultReferences();
      // },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchRefsForPage: fetchRefsForPage,
   //fetchSearchResults: fetchSearchResults,
   //processTitleRefs,
};
export const referenceReducers = referenceSlice.reducer;
