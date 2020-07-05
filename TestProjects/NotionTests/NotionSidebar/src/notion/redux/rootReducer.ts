import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { notionPageReducers } from 'aNotion/services/notionPageSlice';
//import {}

export const rootReducer = combineReducers({
   page: notionPageReducers,
});
export type RootState = ReturnType<typeof rootReducer>;
export const cookieSelector = (state: RootState) => state.page.cookie;
export const navigationSelector = (state: RootState) => state.page.navigation;
