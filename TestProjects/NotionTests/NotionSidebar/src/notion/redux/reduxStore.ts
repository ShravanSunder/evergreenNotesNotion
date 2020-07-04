import {
   configureStore,
   getDefaultMiddleware,
   combineReducers,
} from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

const rootReducer = combineReducers({
   data: () => {
      return {};
   },
});
export type RootState = ReturnType<typeof rootReducer>;

const preloadedState = {
   // data: [],
} as RootState;

const middleware = [...getDefaultMiddleware(), logger];

//@ts-ignore
export const reduxStore = configureStore({
   reducer: rootReducer,
   middleware: middleware,
   devTools: process.env.NODE_ENV !== 'production',
   //preloadedState: preloadedState,
});

export default reduxStore;
