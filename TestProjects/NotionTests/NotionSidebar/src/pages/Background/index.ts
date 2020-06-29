import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

// Regex-pattern to check URLs against.
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?notion.so/;

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//       var t = tabs[0] ?? '';
//       if (t.id != null && t.url != null) {
//          if (urlRegex.test(t.url)) {
//             // ...if it matches, send a message specifying a callback too
//             chrome.tabs.sendMessage(t.id, { command: 'chromeOnClick' });
//          }
//       }
//    });
//    if (tab.url != null && tab.id != null && changeInfo.status === 'complete') {
//       if (urlRegex.test(tab.url)) {
//          alert('dsfsdfs');
//          // ...if it matches, send a message specifying a callback too
//          chrome.tabs.sendMessage(tab.id, { command: 'notionTabLoaded' });
//       }
//    }
// });

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
