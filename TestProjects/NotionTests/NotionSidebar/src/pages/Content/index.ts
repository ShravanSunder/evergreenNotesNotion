import { mountSidebar } from './SidebarFrame';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.command === 'notionTabLoaded') {
      initalize();
   } else if (request.command === 'chromeOnClick') {
      console.log('afdsfsdfsdfdsfsdf');
      initalize();
      toggleSidebar();
   }
});

const notionAppId = 'notion-app';
const notionSidebarRootId = 'notion-sidebar-root-987384';
const notionBaseNewRootId = 'notion-base-new-root';
const initalize = () => {
   if (!document.getElementById(notionSidebarRootId)) {
      let sidebarRoot = document.createElement('div');
      document.body.appendChild(sidebarRoot);
      sidebarRoot.setAttribute('id', notionSidebarRootId);

      let newRoot = document.createElement('div');
      document.body.appendChild(newRoot);
      newRoot.setAttribute('id', notionBaseNewRootId);
   }

   var sidebarRoot = document.getElementById(notionSidebarRootId);
   var newRoot = document.getElementById(notionBaseNewRootId);
   var notionApp = document.getElementById(notionAppId);

   if (sidebarRoot && newRoot && notionApp) {
      mountSidebar(sidebarRoot, newRoot, notionApp);
   }
};

const toggleSidebar = () => {};
