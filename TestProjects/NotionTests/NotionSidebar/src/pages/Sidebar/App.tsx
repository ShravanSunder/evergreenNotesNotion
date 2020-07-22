import { hot } from 'react-hot-loader/root';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import reduxStore, { appDispatch } from 'aNotion/providers/reduxStore';
import { commands } from 'aCommon/commands';
import { activeTab } from 'aCommon/extensionHelpers';
import { Layout } from 'aNotion/components/Layout';
import { registerListener as registerCookiesListener } from './appListeners';
import 'chrome-extension-async';
import { registerTabUpdateListener } from 'aNotion/services/notionListeners';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { ThemeProvider } from '@material-ui/core';
import { theme } from 'aNotion/components/Theme';
import logger from 'redux-logger';

import Debug from 'debug';
export const debug = Debug('NS');

debug('App loading...');

const App = () => {
   setTabId();
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

const fetchCookies = async (tabId: number) => {
   chrome.runtime.sendMessage({
      command: commands.fetchCookies,
      tabId: tabId,
   });
};

const hotApp = hot(App);
export default hotApp;
const renderApp = (Component: React.FC) =>
   render(<Component />, window.document.querySelector('#app-container'));
console.log('App loaded!');

renderApp(hotApp);

registerCookiesListener();
registerTabUpdateListener();
