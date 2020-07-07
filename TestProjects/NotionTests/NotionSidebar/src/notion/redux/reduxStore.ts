import {
   configureStore,
   getDefaultMiddleware,
   StoreEnhancer,
} from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import { useDispatch } from 'react-redux';
import { RootState, rootReducer } from './rootReducer';
import { composeWithDevTools } from 'remote-redux-devtools';

console.log('Redux store configuration loaded');

const composeEnhancers = composeWithDevTools({
   hostname: 'localhost',
   port: 8000,
   realtime: true,
   shouldHotReload: true,
});

const preloadedState = {
   // data: [],
} as RootState;

const middleware = getDefaultMiddleware().concat(logger);

//@ts-ignore
export const reduxStore = configureStore({
   reducer: rootReducer,
   middleware: middleware,
   devTools: true, //process.env.NODE_ENV !== 'production',
   //preloadedState: preloadedState,
   enhancers: [composeEnhancers()],
});

export default reduxStore;
export type AppDispatch = typeof reduxStore.dispatch;
export const appDispatch = reduxStore.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type StateSelector<T> = (state: RootState) => T;

export const getAppState = <T>(selector: StateSelector<T>): T => {
   let state = reduxStore.getState();
   return selector(state);
};
