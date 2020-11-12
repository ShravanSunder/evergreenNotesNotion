import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   NotionBlockModel,
   NotionBlockRecord,
} from 'aNotion/models/NotionBlock';
import { NotionPageMarks } from 'aNotion/models/NotionPage';
import * as blockService from 'aNotion/services/blockService';
import * as pageService from 'aNotion/services/pageService';
import { PageMarkState } from 'aNotion/components/pageMarks/pageMarksState';
import { sidebarExtensionActions } from '../layout/sidebarExtensionSlice';
import { updateStatus } from 'aNotion/types/updateStatus';

const initialState: PageMarkState = {
   status: thunkStatus.idle,
};

const processPageForMarks = createAsyncThunk<
   NotionPageMarks,
   { pageId: string; record: NotionBlockRecord; signal: AbortSignal }
>(
   'notion/page/processPage',
   async ({ pageId, record, signal }, thunkApi): Promise<NotionPageMarks> => {
      let marks = await pageService.processPageForMarks(pageId, record, signal);
      thunkApi.dispatch(
         sidebarExtensionActions.setUpdateMarksStatus(
            updateStatus.updateSuccessful
         )
      );
      return marks;
   }
);

const pageMarkSlice = createSlice({
   name: 'pageMarkSlice',
   initialState: initialState,
   reducers: {},
   extraReducers: {
      [processPageForMarks.fulfilled.toString()]: (
         state,
         action: PayloadAction<NotionPageMarks>
      ) => {
         state.pageMarks = action.payload;
         state.status = thunkStatus.fulfilled;
      },
      [processPageForMarks.pending.toString()]: (
         state,
         action: PayloadAction<NotionPageMarks>
      ) => {
         state.pageMarks = undefined;
         state.status = thunkStatus.pending;
      },
      [processPageForMarks.rejected.toString()]: (
         state,
         action: PayloadAction<NotionPageMarks>
      ) => {
         state.pageMarks = undefined;
         state.status = thunkStatus.rejected;
      },
   },
});

export const pageMarkActions = {
   ...pageMarkSlice.actions,
   processPageForMarks,
};
export const pageMarkReducers = pageMarkSlice.reducer;
