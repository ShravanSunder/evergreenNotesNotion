import { extractPageData } from 'aNotion/services/notionPage';

export const registerTabUpdateListener = () => {
   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      extractPageData(tab.url);
   });
};
