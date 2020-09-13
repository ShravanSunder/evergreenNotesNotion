//import { hot } from 'react-hot-loader/root';
import React, {
   useEffect,
   useCallback,
   useState,
   Suspense,
   SyntheticEvent,
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
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import {
   FindInPageTwoTone,
   BookTwoTone,
   SubjectTwoTone,
   RefreshTwoTone,
   SettingsTwoTone,
} from '@material-ui/icons/';
import { lightGreen, grey } from '@material-ui/core/colors';
import {
   makeStyles,
   Theme,
   createStyles,
   Grid,
   Typography,
   IconButton,
} from '@material-ui/core';
import { LoadingTab } from '../common/Loading';
import { LightTooltip } from '../common/Styles';

const ReferencesPane = React.lazy(() => import('../references/ReferencesPane'));
const MarksPane = React.lazy(() => import('../pageMarks/MarksPane'));
const SearchPane = React.lazy(() => import('../references/SearchPane'));
const OptionsPane = React.lazy(() => import('../options/OptionsPane'));

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
   References = 'Page References',
   Search = 'Search',
   PageMarkups = 'Page Markups',
   Events = 'Events',
   Mentions = 'Mentions',
   Options = 'Options',
}

const MenuBar = ({
   tab,
   setTab,
}: {
   tab: LayoutTabs;
   setTab: React.Dispatch<React.SetStateAction<LayoutTabs>>;
}) => {
   const classes = useStyles();

   const dispatch = useDispatch();
   const navigation = useSelector(navigationSelector, shallowEqual);

   const handleTab = (
      event: React.MouseEvent<HTMLElement>,
      newTab: LayoutTabs | null
   ) => {
      if (newTab != null) {
         setTab(newTab);
      }
   };

   const handleRefresh = (e: SyntheticEvent) => {
      if (navigation.pageId != null) {
         dispatch(
            notionSiteActions.fetchCurrentPage({
               pageId: navigation.pageId,
            })
         );
      }
   };

   return (
      <>
         <div
            style={{
               backgroundColor: lightGreen[50],
               borderRadius: 9,
               padding: 6,
            }}>
            <Grid container justify="flex-start">
               <Grid xs={1} item>
                  <div style={{ marginTop: 11 }}>
                     <LightTooltip
                        title="Refresh Notion Page Information"
                        placement="top">
                        <IconButton size="small" onClick={handleRefresh}>
                           <RefreshTwoTone />
                        </IconButton>
                     </LightTooltip>
                  </div>
               </Grid>
               <Grid xs item container spacing={1} justify="center">
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
                           value={LayoutTabs.PageMarkups}
                           className={classes.toggleButton}>
                           <SubjectTwoTone></SubjectTwoTone>
                        </ToggleButton>
                        <ToggleButton
                           value={LayoutTabs.Search}
                           className={classes.toggleButton}>
                           <FindInPageTwoTone></FindInPageTwoTone>
                        </ToggleButton>
                        {/* <ToggleButton
                           value={LayoutTabs.Options}
                           className={classes.toggleButton}>
                           <SettingsTwoTone></SettingsTwoTone>
                        </ToggleButton> */}
                     </ToggleButtonGroup>
                  </Grid>
               </Grid>
               <Grid xs={1} item></Grid>
            </Grid>

            <Grid container spacing={1} justify="center">
               <Grid item>
                  <Typography
                     variant="h4"
                     style={{
                        marginTop: 9,
                        marginBottom: 6,
                        fontVariant: 'small-caps',
                     }}>
                     <strong>{tab}</strong>
                  </Typography>
               </Grid>
            </Grid>
         </div>
      </>
   );
};

export const Layout = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);
   const navigation = useSelector(navigationSelector, shallowEqual);

   const classes = useStyles();

   const updateCurrentPageId = useCallback(async () => {
      getCurrentUrl().then((url) =>
         dispatch(notionSiteActions.currentPage(url))
      );
   }, [dispatch]);

   const [tab, setTab] = useState(LayoutTabs.References);

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
         <>
            <MenuBar tab={tab} setTab={setTab}></MenuBar>
            <div style={{ marginTop: 12 }}></div>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
               <Suspense fallback={<LoadingTab />}>
                  {tab === LayoutTabs.References && <ReferencesPane />}
                  {tab === LayoutTabs.PageMarkups && <MarksPane />}
                  <div
                     style={{
                        display: tab === LayoutTabs.Search ? 'block' : 'none',
                     }}>
                     <SearchPane />
                  </div>
                  {tab === LayoutTabs.Events && <div>not implemented</div>}
                  {tab === LayoutTabs.Options && <OptionsPane />}
               </Suspense>
            </ErrorBoundary>
            <div style={{ marginTop: 12 }}></div>
         </>
      </ErrorBoundary>
   );
};

export default Layout;
