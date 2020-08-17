import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import { SearchSort } from 'aNotion/api/v3/apiReqTypes';
import {
   ReferenceState,
   searchReferences,
   initReferences,
} from './referenceState';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { createReferences } from 'aNotion/services/referenceService';

const initialState: ReferenceState = {
   pageReferences: initReferences(),
   pageReferencesStatus: thunkStatus.idle,
   searchResults: initReferences(),
   resultResultsStatus: thunkStatus.idle,
};

const fetchRefsForPage = createAsyncThunk(
   'notion/reference/current',
   async (
      { query, pageId }: { query: string; pageId: string | undefined },
      thunkApi
   ) => {
      let result1 = await searchApi.searchByRelevance(
         query,
         false,
         50,
         SearchSort.Relevance,
         thunkApi.signal
      );
      if (result1 != null && !thunkApi.signal.aborted) {
         return createReferences(query, result1, pageId);
      }

      return result1;
   }
);

const fetchSearchResults = createAsyncThunk(
   'notion/reference/serch',
   async ({ query }: { query: string }, thunkApi) => {
      let result1 = await searchApi.searchByRelevance(
         query,
         false,
         50,
         SearchSort.Relevance,
         thunkApi.signal
      );
      if (result1 != null && !thunkApi.signal.aborted) {
         return createReferences(query, result1, undefined);
      }

      return result1;
   }
);

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state
) => {
   state.pageReferences = initReferences();
   state.pageReferencesStatus = thunkStatus.pending;
};

const referenceSlice = createSlice({
   name: 'referenceSlice',
   initialState: initialState,
   reducers: {
      unloadReferences: unloadReferences,
   },
   extraReducers: {
      [fetchRefsForPage.fulfilled.toString()]: (
         state,
         action: PayloadAction<searchReferences>
      ) => {
         state.pageReferences = action.payload;
         state.pageReferencesStatus = thunkStatus.fulfilled;
      },
      [fetchRefsForPage.pending.toString()]: (state) => {
         state.pageReferencesStatus = thunkStatus.pending;
         state.pageReferences = initReferences();
      },
      [fetchRefsForPage.rejected.toString()]: (state) => {
         state.pageReferencesStatus = thunkStatus.rejected;
         state.pageReferences = initReferences();
      },
      [fetchSearchResults.fulfilled.toString()]: (
         state,
         action: PayloadAction<searchReferences>
      ) => {
         state.searchResults = action.payload;
         state.resultResultsStatus = thunkStatus.fulfilled;
      },
      [fetchSearchResults.pending.toString()]: (state) => {
         state.resultResultsStatus = thunkStatus.pending;
         state.searchResults = initReferences();
      },
      [fetchRefsForPage.rejected.toString()]: (state) => {
         state.resultResultsStatus = thunkStatus.rejected;
         state.searchResults = initReferences();
      },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchRefsForPage: fetchRefsForPage,
   fetchSearchResults: fetchSearchResults,
   //processTitleRefs,
};
export const referenceReducers = referenceSlice.reducer;
