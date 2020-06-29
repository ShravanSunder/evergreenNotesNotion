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
const notionScrollerClass = 'notion-scroller';
const notionSideClass = 'notion-sidebar-container';
const notionSidebarRootId = 'notion-sidebar-root-987384';
const notionBaseNewRootId = 'new-app-root';
var initalized = false;

const initalize = () => {
   let notionApp = document.getElementById(notionAppId);
   let notionFrame = document.getElementsByClassName(notionFrameClass)[0];
   let notionSide = document.getElementsByClassName(notionSideClass)[0];
   let notionContentScroller = notionFrame.getElementsByClassName(
      notionScrollerClass
   )[0];

   if (!notionApp || !notionFrame || !notionContentScroller) {
      error('could not find notion elements');
   } else if (!initalized) {
      initalized = true;
      if (!document.getElementById(notionSidebarRootId)) {
         let newRoot = document.createElement('div');
         document.body.appendChild(newRoot);
         newRoot.setAttribute('id', notionBaseNewRootId);

         let sidebarRoot = document.createElement('div');
         sidebarRoot.setAttribute('id', notionSidebarRootId);
         newRoot.appendChild(notionApp);
         newRoot.appendChild(sidebarRoot);
      }

      let sidebarRoot = document.getElementById(notionSidebarRootId);

      if (sidebarRoot && notionApp && notionFrame && notionContentScroller) {
         let nSideWidth = Math.round(notionSide.getBoundingClientRect().width);
         let fullWidth = Math.round(notionFrame.getBoundingClientRect().width);
         let sidebarWidth = Math.round((fullWidth - nSideWidth) * 0.15);
         let nFrameWidth = Math.round((fullWidth - nSideWidth) * 0.85);
         let nAppWidth = fullWidth - sidebarWidth;

         //Todo add a obeserver: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
         notionContentScroller.setAttribute(
            'style',
            `max-width:${nFrameWidth}px; overflow:auto`
         );
         notionApp.setAttribute('style', `max-width:${nAppWidth}px`);
         sidebarRoot.setAttribute('style', `max-width:${sidebarWidth}px`);
      }
   }

   let sidebarRoot = document.getElementById(notionSidebarRootId);
   sidebarRoot && mountSidebar(sidebarRoot);
   return true;
};

const error = (str: string) => {
   console.log(str);
};

const toggleSidebar = () => {};
