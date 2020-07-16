import { getCurrentTabId } from 'aCommon/extensionHelpers';
import { appDispatch } from 'aNotion/providers/reduxStore';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { referenceActions } from 'aNotion/components/references/referenceSlice';

export const registerTabUpdateListener = () => {
   chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
      if (changeInfo.status === 'loading') {
         if (isNotionTab(tab!) && tab.id === getCurrentTabId()) {
            console.log('debug unload');
            appDispatch(referenceActions.unloadReferences());
         }
      }
      if (changeInfo.status === 'complete') {
         console.log('debug completed');
         if (isNotionTab(tab!) && tab.id === getCurrentTabId()) {
            appDispatch(notionSiteActions.currentPage(tab.url!));
         }
      }
   });
};

const isNotionTab = (tab: chrome.tabs.Tab) => {
   let urlRegex = /^https?:\/\/(?:[^./?#]+\.)?notion.so/;
   if (tab.id != null && tab.url != null) {
      if (urlRegex.test(tab.url)) {
         return true;
      }
   }
   return false;
};
