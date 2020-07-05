import { extractNavigationData } from 'aNotion/services/notionPage';

export const registerTabUpdateListener = () => {
   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      extractNavigationData(tab.url);
   });
};
