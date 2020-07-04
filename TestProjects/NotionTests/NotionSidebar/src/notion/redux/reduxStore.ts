import {
   configureStore,
   getDefaultMiddleware,
   combineReducers,
} from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import { useDispatch } from 'react-redux';

const rootReducer = combineReducers({
   data: () => {
      return {};
   },
});
export type RootState = ReturnType<typeof rootReducer>;

const preloadedState = {
   // data: [],
} as RootState;

const middleware = getDefaultMiddleware().concat(logger);

//@ts-ignore
export const reduxStore = configureStore({
   reducer: rootReducer,
   middleware: middleware,
   devTools: process.env.NODE_ENV !== 'production',
   //preloadedState: preloadedState,
});

export default reduxStore;

export type AppDispatch = typeof reduxStore.dispatch;
export const appDispatch = reduxStore.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
