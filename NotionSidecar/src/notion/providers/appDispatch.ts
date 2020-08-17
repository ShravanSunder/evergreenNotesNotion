import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';
import { reduxStore } from './reduxStore';

//export type AppDispatch = typeof reduxStore.dispatch;
export const appDispatch = reduxStore.dispatch;
// //export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunkDispatch<T> = ThunkDispatch<T, any, AnyAction>;
export type AppPromiseDispatch<T> = AppThunkDispatch<Promise<T>>;
export type StateSelector<T> = (state: RootState) => T;

export const getAppState = <T>(selector: StateSelector<T>): T => {
   let state = reduxStore.getState();
   return selector(state);
};
