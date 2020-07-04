import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import 'chrome-extension-async';
import { commands } from 'aCommon/commands';
import { Tab } from '@material-ui/core';
import 'chrome-extension-async';
import { commandRequest, payloadRequest } from 'aCommon/requests';

console.log('Loaded background page.');

// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?notion.so/;
const notionDomain = 'notion.so';

const isNotionTab = (tab: chrome.tabs.Tab) => {
   if (tab.id != null && tab.url != null) {
      if (urlRegex.test(tab.url)) {
         return true;
      }
   }
   return false;
};

chrome.tabs.onUpdated.addListener(async function(tabId, info, tab) {
   if (info.status === 'complete') {
      if (isNotionTab(tab)) {
         await fetchCookies(tabId);
      }
   }
   //return true;
});

chrome.runtime.onMessage.addListener(async function(request) {
   switch (request.command) {
      case commands.fetchCookies:
         await fetchCookies(request.tabId);
         break;
   }
   // return true;
});

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(async function(tab) {
   let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
   let t = tabs[0];

   if (isNotionTab(tab)) {
      chrome.tabs.sendMessage(tab.id!, {
         command: commands.extensionOnClick,
      } as commandRequest);

      // let cookies = await chrome.cookies.getAll({ domain: 'notion.so' });
      // console.log('got cookies' + cookies);
      // chrome.tabs.sendMessage(t.id!, {
      //    command: commands.receivedCookies,
      //    notionCookies: cookies,
      // });
   }

   // return true;
});

const fetchCookies = async (tabId: number) => {
   let cookies = await chrome.cookies.getAll({ domain: notionDomain });
   console.log('got cookies' + cookies);
   let req = {
      command: commands.receivedCookies,
      payload: cookies,
   } as payloadRequest;

   chrome.tabs.sendMessage(tabId, req);
};
