//import { hot } from 'react-hot-loader/root';
import React, { useEffect, useCallback, useState } from 'react';
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

import { lightGreen, grey } from '@material-ui/core/colors';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { flushCache } from 'aUtilities/apiCache';
import { NavigationState } from 'aNotion/components/layout/SidebarExtensionState';
import { useDebounce, useDebouncedCallback } from 'use-debounce/lib';
import { isGuid } from 'aCommon/extensionHelpers';
import { updateStatus } from 'aNotion/types/updateStatus';
import {
   LayoutMenuBar,
   LayoutTabs,
   refreshSidebarContents,
   useStyles,
} from './LayoutMenuBar';
import { NoNotionPageId } from './NoNotionPageId';
import { TabContent } from './TabContent';

export const ReferencesPane = React.lazy(
   () => import('aNotion/components/references/ReferencesPane')
);
export const MarksPane = React.lazy(
   () => import('aNotion/components/pageMarks/MarksPane')
);
export const SearchPane = React.lazy(
   () => import('aNotion/components/references/SearchPane')
);
export const OptionsPane = React.lazy(
   () => import('aNotion/components/options/OptionsPane')
);

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
                  <LayoutMenuBar tab={tab} setTab={setTab}></LayoutMenuBar>
                  <div style={{ marginTop: 12 }}></div>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                     <TabContent
                        debouncedStatus={debouncedStatus}
                        tabsWithoutSiteLoading={tabsWithoutSiteLoading}
                        tab={tab}
                     />
                  </ErrorBoundary>
                  <div style={{ marginTop: 12 }}></div>
               </>
            )}
         </>
      </ErrorBoundary>
   );
};

export default Layout;
