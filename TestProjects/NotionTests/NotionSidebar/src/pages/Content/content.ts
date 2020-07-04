import { mountSidebar } from './SidebarFrame';
import { commands } from 'aCommon/commands';
import 'chrome-extension-async';
import { reduceNotionContentPadding } from 'aNotion/styleFixes';
import {
   toggleSidebar,
   createNewRootElement,
   adjustSidebarWidth,
} from './sidebarElements';

console.log('Content script loaded!');

chrome.runtime.onMessage.addListener(async function(
   request,
   sender,
   sendResponse
) {
   switch (request.command) {
      case commands.extensionOnClick: {
         initalize();
         toggleSidebar();
         break;
      }
   }
   return true;
});

const notionAppId = 'notion-app';
export const notionSidebarRootId = 'notion-sidebar-root-987384';
var initalized = false;

const initalize = () => {
   let notionApp = document.getElementById(notionAppId) as HTMLElement;

   if (!notionApp) {
      error('could not find notion elements');
   } else if (!initalized) {
      initalized = true;
      if (!document.getElementById(notionSidebarRootId)) {
         createNewRootElement(notionApp);
      }

      reduceNotionContentPadding(notionApp);
      adjustSidebarWidth(notionApp);
   }

   let sidebarRoot = document.getElementById(notionSidebarRootId);
   if (sidebarRoot) mountSidebar(sidebarRoot);
   return true;
};

const error = (str: string) => {
   console.log(str);
   //add more logging
};
