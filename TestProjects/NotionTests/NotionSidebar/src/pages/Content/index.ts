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

const notionSidebarRoot = 'notion-sidebar-root-987384';
const initalize = () => {
   if (!document.getElementById(notionSidebarRoot)) {
      let sidebarRoot = document.createElement('div');
      document.body.appendChild(sidebarRoot);
      sidebarRoot.setAttribute('id', notionSidebarRoot);
   }

   var sidebarRoot = document.createElement('div');
   mountSidebar(sidebarRoot);
};

const toggleSidebar = () => {};
