import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import {
   FetchTitleRefsParams,
   SearchSort,
} from 'aNotion/api/v3/SearchApiTypes';
import { ReferenceState } from './referenceTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   createUnlinkedReferences,
   UnlinkedReferences,
} from 'aNotion/services/referenceService';

const initialState: ReferenceState = {
   unlinkedReferences: { status: thunkStatus.pending },
};

const fetchRefsBasedOnTitle = createAsyncThunk(
   'notion/reference/current',
   async ({ query }: FetchTitleRefsParams, thunkApi) => {
      let req1 = searchApi.searchByRelevance(
         query,
         false,
         20,
         SearchSort.Relevance,
         thunkApi.signal
      );
      let backRef = '[[' + query + ']]';
      let req2 = searchApi.searchByRelevance(
         backRef,
         true,
         40,
         SearchSort.Relevance,
         thunkApi.signal
      );

      let req3 = searchApi.searchByRelevance(
         query,
         true,
         20,
         SearchSort.Relevance,
         thunkApi.signal
      );

      let result1 = await req1;
      let result2 = await req2;
      let result3 = await req3;
      createUnlinkedReferences(
         query,
         result1,
         result2,
         result3,
         thunkApi.signal
      );
   }
);

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state
) => {
   state.unlinkedReferences.results = undefined;
   state.unlinkedReferences.status = thunkStatus.pending;
};

const referenceSlice = createSlice({
   name: 'referenceSlice',
   initialState: initialState,
   reducers: {
      unloadReferences: unloadReferences,
   },
   extraReducers: {
      [fetchRefsBasedOnTitle.fulfilled.toString()]: (
         state,
         action: PayloadAction<UnlinkedReferences>
      ) => {
         state.unlinkedReferences.results = action.payload;
         state.unlinkedReferences.status = thunkStatus.fulfilled;
      },
      [fetchRefsBasedOnTitle.pending.toString()]: (state) => {
         state.unlinkedReferences.status = thunkStatus.pending;
         state.unlinkedReferences.results = undefined;
      },
      [fetchRefsBasedOnTitle.rejected.toString()]: (state) => {
         state.unlinkedReferences.status = thunkStatus.rejected;
         state.unlinkedReferences.results = undefined;
      },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchTitleRefs: fetchRefsBasedOnTitle,
   //processTitleRefs,
};
export const referenceReducers = referenceSlice.reducer;
