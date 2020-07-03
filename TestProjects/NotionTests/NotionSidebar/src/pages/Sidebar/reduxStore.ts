import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';

const rootReducer = {
   data: {},
};

const preloadedState = {
   data: [],
};

const middleware = [...getDefaultMiddleware(), logger];

//@ts-ignore
export const reduxStore = configureStore({
   reducer: rootReducer as any,
   middleware: middleware,
   devTools: process.env.NODE_ENV !== 'production',
   preloadedState: preloadedState,
});
