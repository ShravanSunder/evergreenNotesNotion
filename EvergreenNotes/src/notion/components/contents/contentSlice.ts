import {
   createSlice,
   createAsyncThunk,
   PayloadAction,
   CaseReducer,
} from '@reduxjs/toolkit';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   ContentState,
   ContentBlocks,
} from 'aNotion/components/contents/contentState';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { RootState } from 'aNotion/providers/rootReducer';
import { fetchContentForBlock } from 'aNotion/services/recordService';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';

const initialState: ContentState = {};

const fetchContent = createAsyncThunk<
   ContentBlocks[] | undefined,
   {
      blockId: string;
      forceUpdate: boolean;
      signal?: AbortSignal;
   }
>(
   'notion/fetchContent',
   async (
      {
         blockId,
         forceUpdate,
         signal,
      }: {
         blockId: string;
         forceUpdate: boolean;
         signal?: AbortSignal;
      },
      thunkApi
   ) => {
      try {
         const state = contentSelector(thunkApi.getState() as any);
         const data = checkStateForContent(state, blockId);
         if (
            data?.content == null ||
            data?.status != thunkStatus.fulfilled ||
            data?.status == null ||
            forceUpdate
         ) {
            const result = await fetchContentForBlock(blockId, thunkApi.signal);
            return result;
         } else {
            return undefined;
         }
      } catch (err) {
         console.log(err);
         throw err;
      }
   },
   {
      condition: ({ blockId, forceUpdate, signal }, { getState, extra }) => {
         //if status is pending, don't continue
         let state = contentSelector(getState() as RootState) as ContentState;
         const data = checkStateForContent(state, blockId);
         if (
            forceUpdate != true &&
            data != null &&
            data.status === thunkStatus.pending &&
            !signal?.aborted
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
): { content: INotionBlockModel[]; status: thunkStatus } | undefined => {
   if (
      state[blockId] != null &&
      state[blockId].status != null &&
      state[blockId].content != null
   ) {
      return state[blockId];
   }
   return undefined;
};

const clearContentReducer: CaseReducer<ContentState> = (
   state: ContentState
) => {
   state = {};
};

const contentSlice = createSlice({
   name: 'contentSlice',
   initialState: initialState,
   reducers: {
      clearContent: clearContentReducer,
   },
   extraReducers: {
      [fetchContent.fulfilled.toString()]: (
         state,
         action: PayloadAction<ContentBlocks[] | undefined>
      ) => {
         if (action.payload != null) {
            action.payload.forEach((contentBlocks) => {
               state[contentBlocks.blockId] = {
                  content: contentBlocks.content,
                  status: thunkStatus.fulfilled,
               };
            });
         }
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
