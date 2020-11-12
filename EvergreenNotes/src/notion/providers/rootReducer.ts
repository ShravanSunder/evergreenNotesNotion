import { combineReducers, Reducer } from '@reduxjs/toolkit';

import { sidebarExtensionReducers } from 'aNotion/components/layout/sidebarExtensionSlice';
import { referenceReducers } from 'aNotion/components/references/referenceSlice';
import { contentReducers } from 'aNotion/components/contents/contentSlice';
import { blockReducers } from 'aNotion/components/blocks/blockSlice';
import { pageMarkReducers } from 'aNotion/components/pageMarks/pageMarksSlice';
import { mentionsReducers } from 'aNotion/components/mentions/mentionsSlice';
//import {}

export const rootReducer = combineReducers({
   sidebarExtension: sidebarExtensionReducers,
   references: referenceReducers,
   content: contentReducers,
   blocks: blockReducers,
   pageMarks: pageMarkReducers,
   mentions: mentionsReducers,
});
export type RootState = ReturnType<typeof rootReducer>;
