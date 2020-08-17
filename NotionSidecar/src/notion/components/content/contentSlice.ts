import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as blockApi from 'aNotion/api/v3/blockApi';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { getBlockFromPageChunk } from 'aNotion/services/blockService';
import { ContentState } from 'aNotion/components/content/contentState';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { RootState } from 'aNotion/providers/rootReducer';

const initialState: ContentState = {};

const fetchContent = createAsyncThunk(
   'notion/content',
   async (
      { blockId, contentIds }: { blockId: string; contentIds: string[] },
      thunkApi
   ) => {
      let state = contentSelector(
         thunkApi.getState() as RootState
      ) as ContentState;

      //if it gets inefficient, we can use contentIds and syncRecordValues
      return fetchContentIfNotInStore(state, blockId, thunkApi);
   }
);
const fetchContentIfNotInStore = async (
   state: ContentState,
   blockId: string,
   thunkApi: any
) => {
   let data = checkStateForContent(state, blockId);

   if (data?.status !== thunkStatus.fulfilled) {
      let result = await blockApi.loadPageChunk(blockId, 100, thunkApi.signal);
      if (result != null && !thunkApi.signal.aborted) {
         let block = getBlockFromPageChunk(result, blockId);
         return block.getContentNodes();
      }
   } else {
      return data.content;
   }
   return [];
};

const checkStateForContent = (state: ContentState, blockId: string) => {
   if (
      state[blockId] != null &&
      state[blockId].status === thunkStatus.fulfilled
   ) {
      return state[blockId];
   }
   return undefined;
};

const contentSlice = createSlice({
   name: 'contentSlice',
   initialState: initialState,
   reducers: {},
   extraReducers: {
      [fetchContent.fulfilled.toString()]: (state, action) => {
         const { blockId } = action.meta.arg;
         state[blockId] = {
            content: action.payload,
            status: thunkStatus.fulfilled,
         }; // = action.payload;
      },
      [fetchContent.pending.toString()]: (state, action) => {
         const { blockId } = action.meta.arg;
         let data = checkStateForContent(state, blockId);
         if (data?.status !== thunkStatus.fulfilled) {
            state[blockId] = {
               content: [],
               status: thunkStatus.pending,
            };
         }
      },
      [fetchContent.rejected.toString()]: (state, action) => {
         const { blockId } = action.meta.arg;
         let data = checkStateForContent(state, blockId);
         if (data?.status !== thunkStatus.fulfilled) {
            state[blockId] = {
               content: [],
               status: thunkStatus.rejected,
            };
         }
      },
   },
});

export const contentActions = {
   ...contentSlice.actions,
   fetchContent: fetchContent,
};
export const contentReducers = contentSlice.reducer;
