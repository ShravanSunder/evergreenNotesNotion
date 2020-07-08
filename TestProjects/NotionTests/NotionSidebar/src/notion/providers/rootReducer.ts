import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { notionSiteReducers } from 'aNotion/components/notionSiteSlice';
//import {}

export const rootReducer = combineReducers({
   site: notionSiteReducers,
});
export type RootState = ReturnType<typeof rootReducer>;
export const cookieSelector = (state: RootState) => state.site.cookie;
export const navigationSelector = (state: RootState) => state.site.navigation;
export const currentRecordSelector = (state: RootState) =>
   state.site.currentPageRecord;
