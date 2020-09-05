import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { fetchPageRecord } from 'aNotion/services/blockService';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { RecordState } from 'aNotion/components/blocks/blockState';
import { blockSelector } from 'aNotion/providers/storeSelectors';
import { RootState } from 'aNotion/providers/rootReducer';

const initialState: RecordState = {};

const fetchBlock = createAsyncThunk(
   'notion/block/',
   async ({ blockId }: { blockId: string }, thunkApi) => {
      let state = blockSelector(
         thunkApi.getState() as RootState
      ) as RecordState;

      //if it gets inefficient, we can use contentIds and syncRecordValues
      return fetchBlockIfNotInStore(state, blockId, thunkApi);
   }
);
const fetchBlockIfNotInStore = async (
   state: RecordState,
   blockId: string,
   thunkApi: any
): Promise<NotionBlockModel | undefined> => {
   let data = checkStateForBlock(state, blockId);

   if (data?.status !== thunkStatus.fulfilled) {
      const [record] = await fetchPageRecord(blockId, thunkApi.signal, true);
      let result = record.toSerializable();
      if (result != null) {
         return result;
      }
   } else {
      return data.block;
   }
   return undefined;
};

const checkStateForBlock = (state: RecordState, blockId: string) => {
   if (
      state[blockId] != null &&
      state[blockId].status === thunkStatus.fulfilled
   ) {
      return state[blockId];
   }
   return undefined;
};

const recordSlice = createSlice({
   name: 'recordSlice',
   initialState: initialState,
   reducers: {},
   extraReducers: {
      [fetchBlock.fulfilled.toString()]: (state, action) => {
         const { blockId } = action.meta.arg;
         state[blockId] = {
            block: action.payload,
            status: thunkStatus.fulfilled,
         }; // = action.payload;
      },
      [fetchBlock.pending.toString()]: (state, action) => {
         const { blockId } = action.meta.arg;
         let data = checkStateForBlock(state, blockId);
         if (data?.status !== thunkStatus.fulfilled) {
            state[blockId] = {
               block: undefined,
               status: thunkStatus.pending,
            };
         }
      },
      [fetchBlock.rejected.toString()]: (state, action) => {
         const { blockId } = action.meta.arg;
         let data = checkStateForBlock(state, blockId);
         if (data?.status !== thunkStatus.fulfilled) {
            state[blockId] = {
               block: undefined,
               status: thunkStatus.rejected,
            };
         }
      },
   },
});

export const blockActions = {
   ...recordSlice.actions,
   fetchBlock: fetchBlock,
};
export const blockReducers = recordSlice.reducer;
