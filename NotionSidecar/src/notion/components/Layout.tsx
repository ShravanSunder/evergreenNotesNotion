//import { hot } from 'react-hot-loader/root';
import React, { useEffect, useCallback, useState } from 'react';
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
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { FindInPageTwoTone, BookTwoTone } from '@material-ui/icons/';
import { lightGreen } from '@material-ui/core/colors';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      grouped: {
         margin: theme.spacing(0.5),
         border: 'none',
         '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
         },
         '&:first-child': {
            borderRadius: theme.shape.borderRadius,
         },
      },
      toggleButton: {
         color: lightGreen[700],
         backgroundColor: lightGreen[50],
         '&$checked': {
            color: lightGreen[900],
            backgroundColor: lightGreen[200],
         },
      },
   })
);

const Layout = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);
   const navigation = useSelector(navigationSelector, shallowEqual);

   const classes = useStyles();

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
            })
         );

         return () => {
            promise.abort();
         };
      }
      return () => {};
   }, [navigation.pageId, navigation.url, dispatch]);

   const [tab, setTab] = useState('references');

   const handleTab = (
      event: React.MouseEvent<HTMLElement>,
      newTab: string | null
   ) => {
      if (newTab != null) setTab(newTab);
   };

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <React.Fragment>
            <ToggleButtonGroup
               className={classes.grouped}
               size="small"
               value={tab}
               exclusive
               onChange={handleTab}>
               <ToggleButton
                  value="references"
                  className={classes.toggleButton}>
                  <BookTwoTone></BookTwoTone>
               </ToggleButton>
               <ToggleButton value="search" className={classes.toggleButton}>
                  <FindInPageTwoTone></FindInPageTwoTone>
               </ToggleButton>
               <ToggleButton></ToggleButton>
               <ToggleButton></ToggleButton>
            </ToggleButtonGroup>
            <ReferencesPane />
         </React.Fragment>
      </ErrorBoundary>
   );
};

export default Layout;
//export default hot(Layout);
