import { extractNavigationData } from 'aNotion/services/notionSiteService';

export const registerTabUpdateListener = () => {
   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      extractNavigationData(tab.url);
   });
};
