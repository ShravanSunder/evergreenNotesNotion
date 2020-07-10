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
import { createUnlinkedReferences } from 'aNotion/services/referenceService';
import { SearchRecordModel } from 'aNotion/types/SearchRecord';

const logPath = 'notion/reference/';

const initialState: ReferenceState = {
   unlinkedReferences: { status: thunkStatus.pending },
};

const fetchTitleRefs = createAsyncThunk(
   logPath + 'current',
   async ({ query, limit, sort }: FetchTitleRefsParams, thunkApi) => {
      let result = (await searchApi.searchForTitle(
         query,
         true,
         limit,
         sort
      )) as SearchResultsType;

      //thunkApi.dispatch(processTitleRefs({ searchData: result }));

      return createUnlinkedReferences(result);
   }
);

// type ProcessTitleRefsParams = { searchData: SearchResultsType };
// const processTitleRefs = createAsyncThunk(
//    logPath + 'current',
//    async ({ searchData: refs }: ProcessTitleRefsParams) => {
//       let results = createUnlinkedReferences(refs);
//       return results;
//    }
// );

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
         action: PayloadAction<SearchRecordModel>
      ) => {
         state.unlinkedReferences.results = action.payload;
         state.unlinkedReferences.status = thunkStatus.fulfilled;
         console.log(action.payload);
      },
      [fetchTitleRefs.pending.toString()]: (
         state,
         action: PayloadAction<SearchRecordModel>
      ) => {
         state.unlinkedReferences.status = thunkStatus.pending;
         state.unlinkedReferences.results = undefined;
      },
      [fetchTitleRefs.rejected.toString()]: (
         state,
         action: PayloadAction<SearchRecordModel>
      ) => {
         state.unlinkedReferences.status = thunkStatus.rejected;
      },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchTitleRefs,
   //processTitleRefs,
};
export const referenceReducers = referenceSlice.reducer;
