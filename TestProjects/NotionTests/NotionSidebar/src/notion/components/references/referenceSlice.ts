import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import { SearchSort } from 'aNotion/api/v3/SearchApiTypes';
import {
   ReferenceState,
   PageReferences,
   initPageReference,
} from './referenceTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { createReferences } from 'aNotion/services/referenceService';

const initialState: ReferenceState = {
   pageReferences: initPageReference(),
   status: thunkStatus.pending,
};

const feathRefsForPage = createAsyncThunk(
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

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state
) => {
   state.pageReferences = initPageReference();
   state.status = thunkStatus.pending;
};

const referenceSlice = createSlice({
   name: 'referenceSlice',
   initialState: initialState,
   reducers: {
      unloadReferences: unloadReferences,
   },
   extraReducers: {
      [feathRefsForPage.fulfilled.toString()]: (
         state,
         action: PayloadAction<PageReferences>
      ) => {
         state.pageReferences = action.payload;
         state.status = thunkStatus.fulfilled;
      },
      [feathRefsForPage.pending.toString()]: (state) => {
         state.status = thunkStatus.pending;
         state.pageReferences = initPageReference();
      },
      [feathRefsForPage.rejected.toString()]: (state) => {
         state.status = thunkStatus.rejected;
         state.pageReferences = initPageReference();
      },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchRefsForPage: feathRefsForPage,
   //processTitleRefs,
};
export const referenceReducers = referenceSlice.reducer;
