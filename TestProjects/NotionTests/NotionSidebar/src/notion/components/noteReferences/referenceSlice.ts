import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import { SearchResultsType, SearchSort } from 'aNotion/api/v3/SearchApiTypes';
import { ReferenceState } from './referenceTypes';
import { thunkStatus } from 'aNotion/typing/thunkStatus';
import { createUnlinkedReferences } from 'aNotion/services/referenceService';

const logPath = 'notion/page/';

const initialState: ReferenceState = {
   unlinkedRefs: {},
   searchResults: { status: thunkStatus.pending },
};

type FetchTitleRefsParams = {
   query: string;
   pageTitlesOnly: boolean;
   limit: number;
   sort: SearchSort;
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
      return 1;
   }
);

const referenceSlice = createSlice({
   name: 'locations',
   initialState: initialState,
   reducers: {},
   extraReducers: {
      [fetchTitleRefs.fulfilled.toString()]: (
         state,
         action: PayloadAction<SearchResultsType>
      ) => {
         state.searchResults.results = action.payload;
         state.searchResults.status = thunkStatus.fulfilled;
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
