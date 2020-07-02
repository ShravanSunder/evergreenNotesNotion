import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('Loaded background page.');

// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?notion.so/;

chrome.tabs.onUpdated.addListener(function(tabId, info) {
   console.log('onupdate');
   if (info.status === 'complete') {
      chrome.cookies.getAll({ url: 'www.notion.so' }, function(cookies) {
         console.log(cookies);
      });
   }
});

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      var t = tabs[0];
      console.log('onclick');
      if (t.id != null && t.url != null) {
         if (urlRegex.test(t.url)) {
            chrome.tabs.sendMessage(t.id, { command: 'chromeOnClick' });
         }
      }
   });
});
