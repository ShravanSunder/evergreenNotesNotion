import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import 'chrome-extension-async';
import { msgTypes } from '../Common/msgTypes';

console.log('Loaded background page.');

// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?notion.so/;

// async function doSomething(script) {
//    try {
//        // Query the tabs and continue once we have the result
//        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//        const activeTab = tabs[0];

//        // Execute the injected script and continue once we have the result
//        const results = await chrome.tabs.executeScript(activeTab.id, { code: script });
//        const firstScriptResult = results[0];
//        return firstScriptResult;
//    }
//    catch(err) {
//        // Handle errors from chrome.tabs.query, chrome.tabs.executeScript or my code
//    }
// }

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(async function (tab) {
   let tabs = await chrome.tabs.query({ currentWindow: true, active: true });
   let t = tabs[0];

   if (t?.id != null && t?.url != null) {
      if (urlRegex.test(t.url)) {
         chrome.tabs.sendMessage(t.id, {
            msgType: msgTypes.extensionOnClick,
         });
      }
      let cookies = await chrome.cookies.getAll({ domain: 'notion.so' });
      console.log('got cookies' + cookies);
      chrome.tabs.sendMessage(t.id, {
         msgType: msgTypes.cookies,
         notionCookies: cookies,
      });
   }
});
