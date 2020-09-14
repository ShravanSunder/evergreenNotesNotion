import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   ContentState,
   ContentBlocks,
} from 'aNotion/components/contents/contentState';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { RootState } from 'aNotion/providers/rootReducer';
import { fetchContentForBlock } from 'aNotion/services/recordService';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

const initialState: ContentState = {};

const fetchContent = createAsyncThunk<
   ContentBlocks[],
   {
      blockId: string;
      signal?: AbortSignal;
   }
>(
   'notion/fetchContent',
   async (
      {
         blockId,
      }: {
         blockId: string;
      },
      thunkApi
   ) => {
      try {
         //if it gets inefficient, we can use contentIds and syncRecordValues
         const result = await fetchContentForBlock(blockId, thunkApi.signal);
         return result;
      } catch (err) {
         console.log(err);
         throw err;
      }
   },
   {
      condition: ({ blockId, signal }, { getState, extra }) => {
         let state = contentSelector(getState() as RootState) as ContentState;
         const data = checkStateForContent(state, blockId);
         if (
            data != null &&
            (data.status === thunkStatus.pending ||
               data.status === thunkStatus.fulfilled)
         ) {
            return false;
         }
         return true;
      },
   }
);

const checkStateForContent = (
   state: ContentState,
   blockId: string
): { content: NotionBlockModel[]; status: thunkStatus } | undefined => {
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
      [fetchContent.fulfilled.toString()]: (
         state,
         action: PayloadAction<ContentBlocks[]>
      ) => {
         action.payload.forEach((contentBlocks) => {
            state[contentBlocks.blockId] = {
               content: contentBlocks.content,
               status: thunkStatus.fulfilled,
            };
         });
      },
      [fetchContent.pending.toString()]: (state, action) => {
         const { blockId } = action.meta.arg;
         let data = checkStateForContent(state, blockId);
         if (data?.status !== thunkStatus.fulfilled) {
            //clear block if its in transition
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
            //clear block if its in transition
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
