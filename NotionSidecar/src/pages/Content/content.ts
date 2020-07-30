import { mountSidebar } from '../Sidebar/SidebarFrame';
import 'chrome-extension-async';
import { reduceNotionContentPadding } from 'src/pages/Content/styleFixes';
import {
   toggleSidebar,
   createNewRootElement,
   adjustSidebarWidth,
} from '../Sidebar/sidebarElements';
import { contentCommands, contentCommandRequest } from './contentMessaging';
console.log('Content script loaded!');

const emptyResponse = (sendResponse: (response: any) => void) => {
   sendResponse({});
   return true;
};

chrome.runtime.onMessage.addListener(async function (
   request: contentCommandRequest,
   sender,
   sendResponse
) {
   switch (request.command) {
      case contentCommands.extensionOnClick: {
         initalize(request.tabId);
         toggleSidebar();
         break;
      }
   }
   return emptyResponse(sendResponse);
});

const notionAppId = 'notion-app';
export const notionSidebarRootId = 'notion-sidebar-root-987384';
var initalized = false;
var contentTabId: number | undefined = undefined;

const initalize = (tabId: number) => {
   let notionApp = document.getElementById(notionAppId) as HTMLElement;

   if (!notionApp) {
      error('could not find notion elements');
   } else if (!initalized) {
      initalized = true;
      contentTabId = tabId;

      if (!document.getElementById(notionSidebarRootId)) {
         createNewRootElement(notionApp);
      }

      //reduceNotionContentPadding(notionApp);
      adjustSidebarWidth(notionApp);
   }

   let sidebarRoot = document.getElementById(notionSidebarRootId);
   if (sidebarRoot) mountSidebar(sidebarRoot, tabId);
};

const error = (str: string) => {
   console.log(str);
   //add more logging
};
