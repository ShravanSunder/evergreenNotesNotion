import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { notionSiteReducers } from 'aNotion/components/layout/notionSiteSlice';
import { referenceReducers } from 'aNotion/components/references/referenceSlice';
import { contentReducers } from 'aNotion/components/content/contentSlice';
import { blockReducers } from 'aNotion/components/blocks/blockSlice';
import { pageMarkReducers } from 'aNotion/components/pageMarks/pageMarksSlice';
//import {}

export const rootReducer = combineReducers({
   site: notionSiteReducers,
   references: referenceReducers,
   content: contentReducers,
   blocks: blockReducers,
   pageMarks: pageMarkReducers,
   // page: pageReducers,
   // view: viewReducer
});
export type RootState = ReturnType<typeof rootReducer>;
