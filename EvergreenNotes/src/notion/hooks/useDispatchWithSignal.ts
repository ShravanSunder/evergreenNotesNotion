import {
   AsyncThunkAction,
   PayloadAction,
   SerializedError,
   ThunkDispatch,
} from '@reduxjs/toolkit';
import { sidebarExtensionActions } from 'aNotion/components/layout/notionSiteSlice';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { DependencyList, EffectCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

type DispatchPromise = Promise<any> & {
   abort(reason?: string): void;
};
type EffectCondition = () => boolean;

type DispatchAction = AsyncThunkAction<any, any, any>;

export const useDispatchWithSignal = (
   condition: EffectCondition,
   action: DispatchAction,
   deps: DependencyList
) => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const [promise, setPromise] = useState<DispatchPromise>();

   useEffect(() => {
      if (condition()) {
         promise?.abort();
         setPromise(dispatch(action));
      }
   }, [dispatch, ...deps!]);
};
