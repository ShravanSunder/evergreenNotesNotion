import { mountSidebar } from '../Sidebar/SidebarFrame';
import 'chrome-extension-async';
import { createAsFloatingElement } from '../Sidebar/sidebarElements';
import { contentCommands, contentCommandRequest } from './contentMessaging';
import { sleep } from 'aUtilities/helpers';
console.log('Content script loading...');

const emptyResponse = (sendResponse: (response: any) => void) => {
   sendResponse({});
   return true;
};

chrome.runtime.onMessage.addListener(
   async (request: contentCommandRequest, sender, sendResponse) => {
      switch (request.command) {
         case contentCommands.extensionOnClick: {
            initalize();
            break;
         }
      }
      return true; //emptyResponse(sendResponse);
   }
);

const notionAppId = 'notion-app';

export const notionSidebarRootId = 'notion-sidebar-root-987384';
var initalized = false;

const initalize = async () => {
   await sleep(50);

   let notionApp = document.getElementById(notionAppId) as HTMLElement;

   if (!notionApp) {
      error('could not find notion elements');
   } else if (!initalized) {
      initalized = true;

      if (!document.getElementById(notionSidebarRootId)) {
         createAsFloatingElement(notionApp);
      }
   }

   let sidebarRoot = document.getElementById(notionSidebarRootId);
   if (sidebarRoot) mountSidebar(sidebarRoot);
};

initalize();

const error = (str: string) => {
   console.log(str);
   //add more logging
};

console.log('Content script loaded');
