import { getCurrentTabId } from 'aCommon/extensionHelpers';
import { appDispatch } from 'aNotion/providers/appDispatch';
import { sidebarExtensionActions } from 'aNotion/components/layout/sidebarExtensionSlice';

export const registerTabUpdateListener = () => {
   chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'loading') {
         if (isNotionTab(tab!) && tab.id === getCurrentTabId()) {
            appDispatch(sidebarExtensionActions.setPageLoadingStatus());
         }
      }
      if (changeInfo.status === 'complete') {
         if (isNotionTab(tab!) && tab.id === getCurrentTabId()) {
            appDispatch(sidebarExtensionActions.updateNavigationData(tab.url!));
            appDispatch(sidebarExtensionActions.setPageCompletedStatus());
         }
      }

      return true;
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
