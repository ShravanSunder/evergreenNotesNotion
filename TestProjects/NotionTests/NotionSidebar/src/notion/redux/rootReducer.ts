import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { cookieReducers } from 'aNotion/redux/cookieSlice';
//import {}

export const rootReducer = combineReducers({
   cookie: cookieReducers,
});
export type RootState = ReturnType<typeof rootReducer>;

export const cookieSelector = (state: RootState) => state.cookie;
