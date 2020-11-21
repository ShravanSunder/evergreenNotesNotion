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
   currentPageSelector,
   sidebarExtensionSelector,
} from 'aNotion/providers/storeSelectors';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { sidebarExtensionActions } from 'aNotion/components/layout/sidebarExtensionSlice';
import { contentActions } from 'aNotion/components/contents/contentSlice';
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
import {
   AccessIssue,
   LoadingSection,
   LoadingTab,
   LoadingTheNotionPage,
   WaitingToLoadNotionSite,
} from 'aNotion/components/common/Loading';
import { LightTooltip } from 'aNotion/components/common/Styles';
import { flushCache } from 'aUtilities/apiCache';
import { NavigationState } from 'aNotion/components/layout/SidebarExtensionState';
import { useDebounce, useDebouncedCallback } from 'use-debounce/lib';
import { isGuid } from 'aCommon/extensionHelpers';
import { calculateSidebarStatus } from 'aNotion/services/notionSiteService';
import { updateStatus } from 'aNotion/types/updateStatus';

const ReferencesPane = React.lazy(
   () => import('aNotion/components/references/ReferencesPane')
);
const MarksPane = React.lazy(
   () => import('aNotion/components/pageMarks/MarksPane')
);
const SearchPane = React.lazy(
   () => import('aNotion/components/references/SearchPane')
);
const OptionsPane = React.lazy(
   () => import('aNotion/components/options/OptionsPane')
);

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
   References = 'References',
   Search = 'Search',
   PageMarkups = 'Page Markups',
   Events = 'Events',
   Mentions = 'Mentions',
   Settings = 'Settings',
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
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);

   const handleTab = (
      event: React.MouseEvent<HTMLElement>,
      newTab: LayoutTabs | null
   ) => {
      if (newTab != null) {
         setTab(newTab);
      }
   };

   const handleRefresh = (e: SyntheticEvent) => {
      dispatch(
         sidebarExtensionActions.setUpdateReferenceStatus(updateStatus.waiting)
      );
      dispatch(
         sidebarExtensionActions.setUpdateMarksStatus(updateStatus.waiting)
      );
      refreshSidebarContents(dispatch, sidebar.navigation);
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
                        <ToggleButton
                           value={LayoutTabs.Settings}
                           className={classes.toggleButton}>
                           <SettingsTwoTone></SettingsTwoTone>
                        </ToggleButton>
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

const TabLayout = ({ tab }: { tab: LayoutTabs }) => {
   return (
      <>
         <div
            style={{
               display: tab === LayoutTabs.References ? 'block' : 'none',
            }}>
            <ReferencesPane />
         </div>
         <div
            style={{
               display: tab === LayoutTabs.PageMarkups ? 'block' : 'none',
            }}>
            <MarksPane />
         </div>
         <div
            style={{
               display: tab === LayoutTabs.Search ? 'block' : 'none',
            }}>
            <SearchPane />
         </div>
         {tab === LayoutTabs.Events && <div>not implemented</div>}
         {tab === LayoutTabs.Settings && <OptionsPane />}
      </>
   );
};

export const Layout = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);
   const currentPage = useSelector(currentPageSelector, shallowEqual);

   const classes = useStyles();
   const [noNotionPageId, setNoNotionPageId] = useState(false);
   const [debouncedShowNoPageIdError] = useDebounce(noNotionPageId, 500, {
      trailing: true,
   });
   const [debouncedStatus] = useDebounce(sidebar.status, 500, {
      leading: true,
      trailing: true,
   });

   const [tab, setTab] = useState(LayoutTabs.References);

   useEffect(() => {
      setTab(LayoutTabs.References);
   }, []);

   // loading the Notion page content when the page is completely loaded and we have pageId
   // see notionListener -> registerTabUpdateListener for how pageId is obtained
   useEffect(() => {
      if (
         sidebar.navigation.pageId != null &&
         sidebar.status.webpageStatus === thunkStatus.fulfilled &&
         isGuid(sidebar.navigation.pageId)
      ) {
         setNoNotionPageId(false);
         let pr = dispatch(
            sidebarExtensionActions.fetchCurrentNotionPage({
               pageId: sidebar.navigation.pageId,
            })
         );
      } else if (
         sidebar.navigation.pageId == null ||
         !isGuid(sidebar.navigation.pageId)
      ) {
         //unload notion data
         sidebarExtensionActions.unloadPreviousPage();
         setNoNotionPageId(true);
      }
      return () => {};
   }, [
      sidebar.navigation.pageId,
      sidebar.navigation.url,
      sidebar.status.webpageStatus,
      dispatch,
   ]);

   //update page marks data without a full refresh
   const [debouncedCurrentPage] = useDebounce(currentPage.status, 250, {
      trailing: true,
   });

   const [debouncedWebpageStatus] = useDebounce(
      sidebar.status.webpageStatus,
      10000,
      {
         trailing: true,
      }
   );

   const debouncedUpdateSignal = useDebouncedCallback(
      () => {
         if (
            debouncedCurrentPage === thunkStatus.fulfilled &&
            sidebar.navigation.pageId != null &&
            sidebar.status.updateMarks === updateStatus.updateSuccessful &&
            debouncedWebpageStatus === thunkStatus.fulfilled &&
            sidebar.status.webpageStatus === thunkStatus.fulfilled
         ) {
            refreshSidebarContents(dispatch, sidebar.navigation);
         }
      },
      3000,
      {
         maxWait: 60000,
      }
   );

   const handleReceiveMessage = useCallback((event) => {
      if (
         event.data === 'updateEvergreenSidebarData' &&
         event.origin.includes('notion')
      ) {
         debouncedUpdateSignal.callback();
      }
   }, []);

   useEffect(() => {
      window.addEventListener('message', handleReceiveMessage);
      return () => {
         window.removeEventListener('message', handleReceiveMessage);
      };
   }, []);

   const tabsWithoutSiteLoading =
      tab === LayoutTabs.Search || tab === LayoutTabs.Settings;

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <>
            {debouncedShowNoPageIdError && <NoNotionPageId></NoNotionPageId>}
            {!debouncedShowNoPageIdError && (
               <>
                  <MenuBar tab={tab} setTab={setTab}></MenuBar>
                  <div style={{ marginTop: 12 }}></div>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                     <>
                        <Suspense fallback={<AccessIssue />}>
                           {debouncedStatus.webpageStatus ===
                              thunkStatus.idle && <WaitingToLoadNotionSite />}
                           {debouncedStatus.webpageStatus ===
                              thunkStatus.rejected && <AccessIssue />}
                           {calculateSidebarStatus(debouncedStatus) ===
                              thunkStatus.pending &&
                              !tabsWithoutSiteLoading && <LoadingTab />}
                        </Suspense>
                        <Suspense fallback={<LoadingTab />}>
                           {(calculateSidebarStatus(debouncedStatus) ||
                              tabsWithoutSiteLoading) && (
                              <TabLayout tab={tab}></TabLayout>
                           )}
                        </Suspense>
                     </>
                  </ErrorBoundary>
                  <div style={{ marginTop: 12 }}></div>
               </>
            )}
         </>
      </ErrorBoundary>
   );
};

export default Layout;

const NoNotionPageId = () => {
   return (
      <div style={{ padding: 12 }}>
         <div style={{ marginTop: 60 }}></div>
         <Typography variant="h5" style={{ marginTop: 12 }}>
            😵 Couldn't load notion page.
         </Typography>
         <Typography
            variant="subtitle1"
            style={{ marginTop: 12, marginLeft: 3 }}>
            🙋🏾‍♂️ Are you sure you have full access to the space?
         </Typography>
      </div>
   );
};

function refreshSidebarContents(dispatch: any, navigation: NavigationState) {
   console.log('...received refreshSidebarContents updateevergreensidebar');
   if (navigation.pageId != null) {
      flushCache();
      dispatch(contentActions.clearContent());
      dispatch(
         sidebarExtensionActions.fetchCurrentNotionPage({
            pageId: navigation.pageId,
         })
      );
   }
}
