//import { hot } from 'react-hot-loader/root';
import React, {
   useEffect,
   useCallback,
   useState,
   SyntheticEvent,
   Suspense,
} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
   cookieSelector,
   navigationSelector,
} from 'aNotion/providers/storeSelectors';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { notionSiteActions } from './notionSiteSlice';
import { getCurrentUrl } from 'aCommon/extensionHelpers';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import {
   FindInPageTwoTone,
   BookTwoTone,
   SubjectTwoTone,
   AssignmentTurnedInTwoTone,
   EventTwoTone,
} from '@material-ui/icons/';
import { lightGreen, grey } from '@material-ui/core/colors';
import { makeStyles, Theme, createStyles, Box, Grid } from '@material-ui/core';
import { LoadingTab } from '../common/Loading';

const ReferencesPane = React.lazy(() => import('../references/ReferencesPane'));
const HighlightsPane = React.lazy(() => import('../pageMarks/MarksPane'));

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

export enum LayoutTabs {
   References = 'references',
   Search = 'search',
   Highlights = 'highlights',
}

const MenuBar = ({
   tab,
   setTab,
}: {
   tab: string;
   setTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
   const classes = useStyles();

   const handleTab = (
      event: React.MouseEvent<HTMLElement>,
      newTab: string | null
   ) => {
      if (newTab != null) {
         setTab(newTab);
      }
   };

   return (
      <div
         style={{
            backgroundColor: lightGreen[50],
            borderRadius: 9,
            padding: 6,
         }}>
         <Grid container spacing={1} justify="center">
            <Grid item>
               <ToggleButtonGroup
                  className={classes.grouped}
                  size="small"
                  value={tab}
                  exclusive
                  onChange={handleTab}>
                  <ToggleButton
                     value={LayoutTabs.References}
                     className={classes.toggleButton}>
                     <BookTwoTone></BookTwoTone>
                  </ToggleButton>
                  <ToggleButton
                     value={LayoutTabs.Search}
                     className={classes.toggleButton}>
                     <FindInPageTwoTone></FindInPageTwoTone>
                  </ToggleButton>
                  <ToggleButton
                     value={LayoutTabs.Highlights}
                     className={classes.toggleButton}>
                     <SubjectTwoTone></SubjectTwoTone>
                  </ToggleButton>
                  <ToggleButton value="todo" className={classes.toggleButton}>
                     <AssignmentTurnedInTwoTone></AssignmentTurnedInTwoTone>
                  </ToggleButton>
                  <ToggleButton value="events" className={classes.toggleButton}>
                     <EventTwoTone></EventTwoTone>
                  </ToggleButton>
               </ToggleButtonGroup>
            </Grid>
         </Grid>
      </div>
   );
};

export const Layout = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);
   const navigation = useSelector(navigationSelector, shallowEqual);

   const classes = useStyles();

   const updateCurrentPageId = useCallback(async () => {
      let url = await getCurrentUrl();
      dispatch(notionSiteActions.currentPage(url));
   }, [dispatch]);

   const [tab, setTab] = useState('references');

   useEffect(() => {
      setTab(LayoutTabs.References);
   }, []);

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

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <React.Fragment>
            <MenuBar tab={tab} setTab={setTab}></MenuBar>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
               <Suspense fallback={<LoadingTab />}>
                  <div
                     style={{
                        visibility:
                           tab === LayoutTabs.References ? 'visible' : 'hidden',
                     }}>
                     <ReferencesPane />
                  </div>
                  <div
                     style={{
                        visibility:
                           tab === LayoutTabs.Highlights ? 'visible' : 'hidden',
                     }}>
                     <HighlightsPane />
                  </div>
                  <div
                     style={{
                        visibility:
                           tab === LayoutTabs.Search ? 'visible' : 'hidden',
                     }}>
                     <HighlightsPane />
                  </div>
               </Suspense>
            </ErrorBoundary>
         </React.Fragment>
      </ErrorBoundary>
   );
};

export default Layout;
