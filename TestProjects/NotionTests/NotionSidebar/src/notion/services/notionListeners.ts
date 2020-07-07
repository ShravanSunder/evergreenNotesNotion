import { extractNavigationData } from 'aNotion/services/notionSiteService';

export const registerTabUpdateListener = () => {
   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (tab.url !== undefined && isNotionTab(tab!)) {
         extractNavigationData(tab.url);
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
