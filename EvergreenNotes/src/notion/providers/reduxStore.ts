import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import { rootReducer } from './rootReducer';
import { composeWithDevTools } from 'remote-redux-devtools';

console.log('Redux store configuration loaded');

// const composeEnhancers = composeWithDevTools({
//    hostname: 'localhost',
//    port: 8000,
//    realtime: true,
//    shouldHotReload: true,
// });

const middleware = getDefaultMiddleware().concat(logger);

//@ts-ignore
export const reduxStore = configureStore({
   reducer: rootReducer,
   middleware: middleware,
   devTools: true, //process.env.NODE_ENV !== 'production',
   //preloadedState: preloadedState,
   //enhancers: [composeEnhancers()],
});

export default reduxStore;
