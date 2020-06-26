import { mountSidebar } from './SidebarFrame';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   if (request.command === 'notionTabLoaded') {
      initalize();
   } else if (request.command === 'chromeOnClick') {
      console.log('afdsfsdfsdfdsfsdf');
      initalize();
      toggleSidebar();
   }
});

const notionAppId = 'notion-app';
const notionFrameClass = 'notion-frame';
const notionSideClass = 'notion-sidebar-container';
const notionSidebarRootId = 'notion-sidebar-root-987384';
const notionBaseNewRootId = 'notion-base-new-root';
var initalized = false;
const initalize = () => {
   if (!initalized) {
      initalized = true;
      if (!document.getElementById(notionSidebarRootId)) {
         let sidebarRoot = document.createElement('div');
         document.body.appendChild(sidebarRoot);
         sidebarRoot.setAttribute('id', notionSidebarRootId);

         let newRoot = document.createElement('div');
         document.body.appendChild(newRoot);
         newRoot.setAttribute('id', notionBaseNewRootId);
      }

      let sidebarRoot = document.getElementById(notionSidebarRootId);
      let notionApp = document.getElementById(notionAppId);
      let notionFrame = document.getElementsByClassName(notionFrameClass)[0];
      let notionSide = document.getElementsByClassName(notionSideClass)[0];

      if (sidebarRoot && notionApp && notionFrame) {
         let nSideWidth = Math.round(notionSide.getBoundingClientRect().width);
         let fullWidth = Math.round(notionFrame.getBoundingClientRect().width);
         let sidebarWidth = Math.round((fullWidth - nSideWidth) * 0.2);
         let nFrameWidth = Math.round((fullWidth - nSideWidth) * 0.8);
         let nAppWidth = fullWidth - sidebarWidth;

         //Todo add a obeserver: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
         document.append(sidebarRoot);
         notionFrame.setAttribute('style', `max-width:${nFrameWidth}px`);
         notionApp.setAttribute('style', `max-width:${nAppWidth}px`);
         sidebarRoot.setAttribute('style', `max-width:${sidebarWidth}px`);
      }
   }

   let sidebarRoot = document.getElementById(notionSidebarRootId);
   sidebarRoot && mountSidebar(sidebarRoot);
};

const toggleSidebar = () => {};
