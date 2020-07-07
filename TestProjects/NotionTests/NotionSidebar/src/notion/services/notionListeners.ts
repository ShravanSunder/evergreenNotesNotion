import { extractNavigationData } from 'aNotion/services/notionSiteService';
import { getCurrentTabId } from 'aCommon/extensionHelpers';
import { appDispatch } from 'aNotion/redux/reduxStore';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';

export const registerTabUpdateListener = () => {
   chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
      if (changeInfo.status === 'complete') {
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
