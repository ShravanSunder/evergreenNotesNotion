import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
   cookieSelector,
   navigationSelector,
   currentRecordSelector,
} from 'aNotion/providers/rootReducer';
import { UnlinkedReferences } from './references/UnlinkedReferences';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';

//loading fonts recommended by material ui
import 'fontsource-roboto/latin-300.css';
import 'fontsource-roboto/latin-400.css';
import 'fontsource-roboto/latin-500.css';
import 'fontsource-roboto/latin-700.css';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { notionSiteActions } from './notionSiteSlice';
import { getCurrentUrl } from 'aCommon/extensionHelpers';
import { referenceActions } from './references/referenceSlice';

export const Layout = () => {
   let dispatch = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);
   const navigation = useSelector(navigationSelector, shallowEqual);

   useEffect(() => {
      if (cookie.status !== thunkStatus.fulfilled) updateCurrentPageId();
   }, [cookie.status]);

   const updateCurrentPageId = async () => {
      let url = await getCurrentUrl();
      dispatch(notionSiteActions.currentPage(url));
   };

   useEffect(() => {
      if (
         navigation.pageId !== undefined &&
         cookie.status === thunkStatus.fulfilled
      ) {
         dispatch(
            notionSiteActions.fetchCurrentPage({
               pageId: navigation.pageId,
               limit: 1,
            })
         );
         dispatch(referenceActions.unloadReferences());
      }
   }, [navigation.pageId, cookie.status]);

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <UnlinkedReferences />
      </ErrorBoundary>
   );
};
