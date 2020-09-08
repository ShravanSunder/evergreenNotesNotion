import { combineReducers, Reducer } from '@reduxjs/toolkit';

import { referenceReducers } from 'aNotion/components/references/referenceSlice';
import { contentReducers } from 'aNotion/components/contents/contentSlice';
import { blockReducers } from 'aNotion/components/blocks/blockSlice';
import { pageMarkReducers } from 'aNotion/components/pageMarks/pageMarksSlice';
import { notionSiteReducers } from 'aNotion/components/layout/notionSiteSlice';
import { mentionsReducers } from 'aNotion/components/mentions/mentionsSlice';
//import {}

export const rootReducer = combineReducers({
   site: notionSiteReducers,
   references: referenceReducers,
   content: contentReducers,
   blocks: blockReducers,
   pageMarks: pageMarkReducers,
   mentions: mentionsReducers,
   // page: pageReducers,
   // view: viewReducer
});
export type RootState = ReturnType<typeof rootReducer>;
