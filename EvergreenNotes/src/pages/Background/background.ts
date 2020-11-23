import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import 'chrome-extension-async';
import {
   contentCommands,
   contentCommandRequest,
} from '../Content/contentMessaging';
import { emptyResponse } from 'aCommon/extensionHelpers';

console.log('Loading background page...');

// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
const notionDomain = 'notion.so';

const isNotionTab = (tab: chrome.tabs.Tab) => {
   let urlRegex = /^https?:\/\/(?:[^./?#]+\.)?notion.so/;
   if (tab.id != null && tab.url != null) {
      if (urlRegex.test(tab.url)) {
         return true;
      }
   }
   return false;
};

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(async (tab) => {
   if (isNotionTab(tab)) {
      let req = {
         command: contentCommands.extensionOnClick,
         tabId: tab.id!,
      } as contentCommandRequest;
      console.log('send extensionOnClick');
      chrome.tabs.sendMessage(tab.id!, req);
   }
   return true;
});

console.log('Loaded background page');
