//import { hot } from 'react-hot-loader/root';
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
   cookieSelector,
   navigationSelector,
} from 'aNotion/providers/storeSelectors';
import { ReferencesPane } from './references/ReferencesPane';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';

//loading fonts recommended by material ui
// import 'fontsource-roboto/latin-300.css';
// import 'fontsource-roboto/latin-400.css';
// import 'fontsource-roboto/latin-500.css';
// import 'fontsource-roboto/latin-700.css';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { notionSiteActions } from './notionSiteSlice';
import { getCurrentUrl } from 'aCommon/extensionHelpers';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import Box from '@material-ui/core/Box/Box';

const Layout = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);
   const navigation = useSelector(navigationSelector, shallowEqual);

   const updateCurrentPageId = useCallback(async () => {
      let url = await getCurrentUrl();
      dispatch(notionSiteActions.currentPage(url));
   }, [dispatch]);

   useEffect(() => {
      if (cookie.status === thunkStatus.fulfilled) {
         updateCurrentPageId();
      }
   }, [cookie.status, updateCurrentPageId]);

   useEffect(() => {
      if (navigation.pageId != null) {
         let promise = dispatch(
            notionSiteActions.fetchCurrentPage({
               pageId: navigation.pageId,
               limit: 1,
            })
         );

         return () => {
            promise.abort();
         };
      }
      return () => {};
   }, [navigation.pageId, navigation.url, dispatch]);

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <ReferencesPane />
      </ErrorBoundary>
   );
};

export default Layout;
//export default hot(Layout);
