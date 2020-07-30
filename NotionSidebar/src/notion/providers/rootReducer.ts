import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { notionSiteReducers } from 'aNotion/components/notionSiteSlice';
import { referenceReducers } from 'aNotion/components/references/referenceSlice';
import { contentReducers } from 'aNotion/components/blocks/contentSlice';
//import {}

export const rootReducer = combineReducers({
   site: notionSiteReducers,
   references: referenceReducers,
   content: contentReducers,
});
export type RootState = ReturnType<typeof rootReducer>;
