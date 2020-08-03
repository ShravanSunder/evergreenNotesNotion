//import { hot } from 'react-hot-loader';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import reduxStore, { appDispatch } from 'aNotion/providers/reduxStore';
import { commands } from 'aCommon/commands';
import { activeTab } from 'aCommon/extensionHelpers';
import Layout from 'aNotion/components/Layout';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { ThemeProvider } from '@material-ui/core';
import { theme } from 'aNotion/components/Theme';

console.log('App loading...');
export const SidebarApp = () => {
   useEffect(() => {
      setTabId();
   }, []);

   return (
      <React.StrictMode>
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Provider store={reduxStore}>
               <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ThemeProvider theme={theme}>
                     <Layout />
                  </ThemeProvider>
               </ErrorBoundary>
            </Provider>
         </ErrorBoundary>
      </React.StrictMode>
   );
};
const setTabId = async () => {
   let w = window as any;
   if (w.contentTabId === undefined) {
      let tab = await activeTab();
      let tabId = tab.id!;
      w.contentTabId = tabId;
      fetchCookies(tabId);
      appDispatch(notionSiteActions.currentPage(tab.url!));
   }
};
const fetchCookies = (tabId: number) => {
   console.log('send fetchCookies');
   chrome.runtime.sendMessage(
      {
         command: commands.fetchCookies,
         tabId: tabId,
      },
      () => {}
   );
};

export default SidebarApp;
