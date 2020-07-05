import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import * as searchApi from 'aNotion/api/v3/searchApi';
import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';
import { ReferenceState } from './referenceTypes';
import { thunkStatus } from 'aNotion/typing/thunkStatus';

const logPath = 'notion/page/';

const initialState: ReferenceState = {
   unlinkedRefs: {},
   searchResults: { status: thunkStatus.pending },
};

type fetchTitleRefs = { query: string; pageTitlesOnly: boolean; limit: number };
const searchForTitles = createAsyncThunk(
   logPath + 'current',
   async ({ query, limit }: fetchTitleRefs) => {
      return (await searchApi.searchForTitle(
         query,
         true,
         limit
      )) as SearchResultsType;
   }
);

// const loadCookies: CaseReducer<ReferenceState, PayloadAction<Search>> = (
//    state,
//    action
// ) => {
//    state.cookie.data = action.payload;
//    state.cookie.status = thunkStatus.fulfilled;
// };

const referenceSlice = createSlice({
   name: 'locations',
   initialState: initialState,
   reducers: {},
   extraReducers: {
      [searchForTitles.fulfilled.toString()]: (
         state,
         action: PayloadAction<SearchResultsType>
      ) => {
         state.searchResults.results = action.payload;
         state.searchResults.status = thunkStatus.fulfilled;
      },
      [searchForTitles.pending.toString()]: (
         state,
         action: PayloadAction<SearchResultsType>
      ) => {
         state.searchResults.status = thunkStatus.pending;
         state.searchResults.results = undefined;
      },
      [searchForTitles.rejected.toString()]: (
         state,
         action: PayloadAction<SearchResultsType>
      ) => {
         state.searchResults.status = thunkStatus.rejected;
      },
   },
});

export const referenceActions = {
   ...referenceSlice.actions,
};
export const referenceReducers = referenceSlice.reducer;
