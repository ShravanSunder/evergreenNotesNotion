import { commands } from 'aCommon/commands';
import { emptyResponse } from 'aCommon/extensionHelpers';
import { payloadRequest } from 'aCommon/commands';
import { extractUserData } from 'aNotion/services/notionSiteService';

export const registerListener = () => {
   chrome.runtime.onMessage.addListener(
      async (request: payloadRequest, sender: any, sendResponse: any) => {
         switch (request.command) {
            case commands.receivedCookies: {
               let cookie = request.payload as chrome.cookies.Cookie[];
               if (cookie != null) {
                  extractUserData(cookie);
               }
               break;
            }
         }
         //return emptyResponse(sendResponse);
         return true;
      }
   );
};
