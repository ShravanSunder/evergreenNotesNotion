import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { notionCookieReducers } from 'aNotion/services/notionCookieSlice';
//import {}

export const rootReducer = combineReducers({
   cookie: notionCookieReducers,
});
export type RootState = ReturnType<typeof rootReducer>;

export const cookieSelector = (state: RootState) => state.cookie;
