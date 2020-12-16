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
import {
   TAppDispatchWithPromise,
   TPromiseReturendFromDispatch,
} from 'aNotion/providers/appDispatch';

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
import { useWindowWidth } from '@react-hook/window-size';
import {
   menuPadding as topMenuBorder,
   minFrameWidth,
} from 'aSidebar/sidebarFrameProperties';
import {
   EvergreenMessagingEnum,
   TEvergreenMessage,
} from 'aSidebar/sidebarMessaging';
//import { TFrameStatusChanged } from 'aSidebar/messageTypes';

export const Layout = () => {
   const dispatch: TAppDispatchWithPromise<any> = useDispatch();
   const classes = useStyles();

   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);
   const currentPage = useSelector(currentPageSelector, shallowEqual);

   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   const [tab, setTab] = useState(LayoutTabs.References);

   //set the default tab
   useEffect(() => {
      setTab(LayoutTabs.References);
   }, []);

   const [
      fetchCurrentNotionPagePromise,
      setFetchCurrentNotionPagePromise,
   ] = useState<TPromiseReturendFromDispatch>();
   const [noNotionPageId, setNoNotionPageId] = useState(false);
   const [debouncedShowNoPageIdError] = useDebounce(noNotionPageId, 500, {
      trailing: true,
   });
   const [debouncedSidebarStatus] = useDebounce(sidebar.status, 500, {
      leading: true,
      trailing: true,
   });

   /** used by debouncedUpdateSignal */
   const [debouncedCurrentPage] = useDebounce(currentPage.status, 250, {
      trailing: true,
   });

   /** used by debouncedUpdateSignal. Wait for the notion webpage to finish updating */
   const [debouncedWebpageStatus] = useDebounce(
      sidebar.status.notionWebpageLoadingStatus,
      9000,
      {
         trailing: true,
      }
   );

   /**
    * refresh the page if its not updating currently and sufficient time has passed since
    * the page is loaded.
    */
   const debouncedUpdateSignal = useDebouncedCallback(
      () => {
         if (
            debouncedCurrentPage === thunkStatus.fulfilled &&
            sidebar.navigation.pageId != null &&
            sidebar.status.updateMarks === updateStatus.updateSuccessful &&
            debouncedWebpageStatus === thunkStatus.fulfilled &&
            sidebar.status.notionWebpageLoadingStatus === thunkStatus.fulfilled
         ) {
            refreshSidebarContents(dispatch, sidebar.navigation);
         }
      },
      3000,
      {
         maxWait: 60000,
      }
   );

   // loading the Notion page content when the page is completely loaded and we have pageId
   // see notionListener -> registerTabUpdateListener for how pageId is obtained
   useEffect(() => {
      const retryFetch =
         (currentPage.status === thunkStatus.rejected &&
            currentPage.retryCounter <= 3) ||
         currentPage.status !== thunkStatus.rejected;
      const pageIdValid =
         sidebar.navigation.pageId != null &&
         isGuid(sidebar.navigation.pageId) &&
         sidebar.status.notionWebpageLoadingStatus === thunkStatus.fulfilled;

      if (pageIdValid && retryFetch && isSidebarOpen) {
         // fetch the current page if we have the current pageId
         if (fetchCurrentNotionPagePromise != null) {
            //abort the last dispatch chain
            fetchCurrentNotionPagePromise.abort();
         }

         setNoNotionPageId(false);
         let pr = dispatch(
            sidebarExtensionActions.fetchCurrentNotionPage({
               pageId: sidebar.navigation.pageId!,
            })
         );
         setFetchCurrentNotionPagePromise(pr);
      } else if (
         sidebar.navigation.pageId == null ||
         !isGuid(sidebar.navigation.pageId)
      ) {
         //unload notion data if we don't have pageId
         sidebarExtensionActions.unloadPreviousPage();
         setNoNotionPageId(true);
      }
   }, [
      sidebar.navigation.pageId,
      sidebar.navigation.url,
      sidebar.status.notionWebpageLoadingStatus,
      isSidebarOpen,
      dispatch,
   ]);

   /**
    * receive update signal from the parent window via window.postMessage
    */
   const handleUpdateDataReceiveMessage = useCallback((event) => {
      const data = event.data as TEvergreenMessage<any>;
      if (
         data?.type === EvergreenMessagingEnum.updateSidebarData &&
         event.origin.includes('notion')
      ) {
         debouncedUpdateSignal.callback();
      } else if (
         data?.type === EvergreenMessagingEnum.frameStatusChanged &&
         data?.payload != null &&
         event.origin.includes('notion')
      ) {
         const payload = (event.data as TEvergreenMessage<boolean>).payload;
         if (payload != null) {
            setIsSidebarOpen(payload);
         }
      }
   }, []);

   // hook into the event listener
   useEffect(() => {
      window.addEventListener('message', handleUpdateDataReceiveMessage);
      return () => {
         window.removeEventListener('message', handleUpdateDataReceiveMessage);
      };
   }, []);

   const wWidth = useWindowWidth({ wait: 250, leading: true });

   const tabsWithoutSiteLoading =
      tab === LayoutTabs.Search || tab === LayoutTabs.Help;

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <>
            {debouncedShowNoPageIdError && <NoNotionPageId></NoNotionPageId>}
            {!debouncedShowNoPageIdError && (
               <>
                  <div
                     style={{
                        width: wWidth - topMenuBorder,
                        position: 'absolute',
                        zIndex: 100,
                        minWidth: minFrameWidth - topMenuBorder,
                     }}>
                     <LayoutMenuBar tab={tab} setTab={setTab}></LayoutMenuBar>
                  </div>
                  {/* hack for absolute positioning */}
                  <div
                     style={{
                        width: wWidth - topMenuBorder,
                        overflow: 'clip',
                     }}>
                     <LayoutMenuBar tab={tab} setTab={setTab}></LayoutMenuBar>
                  </div>
                  <div style={{ marginTop: 12 }}></div>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                     <div style={{ padding: 12 }}>
                        <TabContent
                           debouncedStatus={debouncedSidebarStatus}
                           tabsWithoutSiteLoading={tabsWithoutSiteLoading}
                           tab={tab}
                        />
                     </div>
                  </ErrorBoundary>
                  <div style={{ marginTop: 12 }}></div>
               </>
            )}
         </>
      </ErrorBoundary>
   );
};

export default Layout;
