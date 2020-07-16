import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import {
   SearchResultsType,
   SearchSort,
   FetchTitleRefsParams,
} from 'aNotion/api/v3/SearchApiTypes';
import { ReferenceState } from './referenceTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   createUnlinkedReferences,
   UnlinkedReferences,
} from 'aNotion/services/referenceService';
import { SearchRecordModel } from 'aNotion/types/SearchRecord';

const logPath = 'notion/reference/';

const initialState: ReferenceState = {
   unlinkedReferences: { status: thunkStatus.pending },
};

const fetchTitleRefs = createAsyncThunk(
   logPath + 'current',
   async (
      { query, limit, pageTitlesOnly, sort }: FetchTitleRefsParams,
      thunkApi
   ) => {
      await thunkApi.dispatch(referenceActions.unloadReferences());
      let result = await searchApi.searchByRelevance(
         query,
         pageTitlesOnly,
         limit,
         sort,
         thunkApi.signal
      );

      return createUnlinkedReferences(result);
   }
);

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state,
   action
) => {
   state.unlinkedReferences.results = undefined;
   state.unlinkedReferences.status = thunkStatus.pending;
};

const referenceSlice = createSlice({
   name: 'locations',
   initialState: initialState,
   reducers: {
      unloadReferences: unloadReferences,
   },
   extraReducers: {
      [fetchTitleRefs.fulfilled.toString()]: (
         state,
         action: PayloadAction<UnlinkedReferences>
      ) => {
         state.unlinkedReferences.results = action.payload;
         state.unlinkedReferences.status = thunkStatus.fulfilled;
      },
      [fetchTitleRefs.pending.toString()]: (
         state,
         action: PayloadAction<UnlinkedReferences>
      ) => {
         state.unlinkedReferences.status = thunkStatus.pending;
         state.unlinkedReferences.results = undefined;
      },
      [fetchTitleRefs.rejected.toString()]: (
         state,
         action: PayloadAction<UnlinkedReferences>
      ) => {
         state.unlinkedReferences.status = thunkStatus.rejected;
         state.unlinkedReferences.results = undefined;
      },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchTitleRefs,
   //processTitleRefs,
};
export const referenceReducers = referenceSlice.reducer;
