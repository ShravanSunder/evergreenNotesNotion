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

const logPath = 'notion/reference/';

const initialState: ReferenceState = {
   unlinkedRefs: {},
   searchResults: { status: thunkStatus.pending },
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

      thunkApi.dispatch(processTitleRefs({ searchData: result }));
      return result;
   }
);

type ProcessTitleRefsParams = { searchData: SearchResultsType };
const processTitleRefs = createAsyncThunk(
   logPath + 'current',
   async ({ searchData: refs }: ProcessTitleRefsParams) => {
      createUnlinkedReferences(refs);
      //return result;
      return '';
   }
);

const unloadReferences: CaseReducer<ReferenceState, PayloadAction> = (
   state,
   action
) => {
   state.searchResults.results = undefined;
   state.searchResults.status = thunkStatus.pending;
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
         action: PayloadAction<SearchResultsType>
      ) => {
         state.searchResults.results = action.payload;
         state.searchResults.status = thunkStatus.fulfilled;
         console.log(action.payload);
      },
      [fetchTitleRefs.pending.toString()]: (
         state,
         action: PayloadAction<SearchResultsType>
      ) => {
         state.searchResults.status = thunkStatus.pending;
         state.searchResults.results = undefined;
      },
      [fetchTitleRefs.rejected.toString()]: (
         state,
         action: PayloadAction<SearchResultsType>
      ) => {
         state.searchResults.status = thunkStatus.rejected;
      },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
   fetchTitleRefs,
   processTitleRefs,
};
export const referenceReducers = referenceSlice.reducer;
