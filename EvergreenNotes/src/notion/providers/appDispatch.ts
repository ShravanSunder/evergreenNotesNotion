import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';
import { reduxStore } from './reduxStore';

export type TAppDispatch = typeof reduxStore.dispatch;
export const appDispatch = reduxStore.dispatch;
// //export const useAppDispatch = () => useDispatch<AppDispatch>();
export type TAppThunkDispatch<T> = ThunkDispatch<T, any, AnyAction>;
export type TAppDispatchWithPromise<T> = TAppThunkDispatch<Promise<T>>;
export type TStateSelector<T> = (state: RootState) => T;

export type TPromiseReturendFromDispatch = Promise<any> & {
   abort(reason?: string): void;
};

export const getAppState = <T>(selector: TStateSelector<T>): T => {
   let state = reduxStore.getState();
   return selector(state);
};
