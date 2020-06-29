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
const notionNavClass = 'notion-sidebar-container';
const notionSidebarRootId = 'notion-sidebar-root-987384';
const notionBaseNewRootId = 'new-app-root';
const notionAppInnerClass = 'notion-app-inner';
var initalized = false;

const initalize = () => {
   let notionApp = document.getElementById(notionAppId);
   let notionFrame = document.getElementsByClassName(notionFrameClass)[0];
   let notionNav = document.getElementsByClassName(notionNavClass)[0];
   let notionContentScroller = notionFrame.getElementsByClassName(
      notionScrollerClass
   )[0];
   let notionAppInnerChildren = document.getElementsByClassName(
      notionAppInnerClass
   )[0].children;

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
         newRoot.setAttribute(
            'style',
            `display:inline-flex; flex-wrap: nowrap; justify-content: flex-start;`
         );
      }

      let sidebarRoot = document.getElementById(notionSidebarRootId);

      if (sidebarRoot && notionApp && notionFrame && notionContentScroller) {
         let nNavWidth = Math.round(notionNav.getBoundingClientRect().width);
         let nFrameWidth = Math.round(
            notionFrame.getBoundingClientRect().width
         );

         let sidebarWidth = Math.round((nFrameWidth + nNavWidth) * 0.25) - 10;
         let newFrameWidth = nFrameWidth - sidebarWidth;
         let newAppWidth = newFrameWidth + nNavWidth + 10;

         //Todo add a obeserver: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
         notionContentScroller.setAttribute(
            'style',
            `max-width:${newFrameWidth}px;`
         );
         notionFrame.setAttribute('style', `max-width:${newFrameWidth}px;`);

         // [...notionAppInnerChildren].forEach((e) => {
         //    e.setAttribute('style', `max-width:${newAppWidth}px;`);
         // });

         notionApp.setAttribute(
            'style',
            `max-width:${newAppWidth}px; overflow:auto;`
         );

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
