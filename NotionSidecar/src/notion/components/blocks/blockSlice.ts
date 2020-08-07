import {
   createSlice,
   createAsyncThunk,
   CaseReducer,
   PayloadAction,
} from '@reduxjs/toolkit';
import {
   CookieData,
   SiteState,
   NavigationState,
} from 'aNotion/components/NotionSiteTypes';
import * as blockApi from 'aNotion/api/v3/blockApi';
import * as LoadPageChunk from 'aNotion/types/notionv3/notionRecordTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   getBlockFromPageChunk,
   fetchPageData,
} from 'aNotion/services/blockService';
import { extractNavigationData } from 'aNotion/services/notionSiteService';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import {
   ContentState,
   RecordState,
} from 'aNotion/components/blocks/contentTypes';
import {
   contentSelector,
   blockSelector,
} from 'aNotion/providers/storeSelectors';
import { RootState } from 'aNotion/providers/rootReducer';
import { loadPageChunk } from 'aNotion/api/v3/blockApi';
import { Satellite } from '@material-ui/icons';

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
      let result = (
         await fetchPageData(blockId, thunkApi.signal, true)
      ).toSerializable();
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

const blockSlice = createSlice({
   name: 'blockSlice',
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
   ...blockSlice.actions,
   fetchBlock: fetchBlock,
};
export const blockReducers = blockSlice.reducer;
