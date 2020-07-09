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

console.log('App loading...');

export const App = () => {
   setTabId();
   useEffect(() => {
      setTabId();
   }, []);

   return (
      <Provider store={reduxStore}>
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Layout />
         </ErrorBoundary>
      </Provider>
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

render(<App />, window.document.querySelector('#app-container'));
console.log('App loaded!');

registerCookiesListener();
registerTabUpdateListener();
