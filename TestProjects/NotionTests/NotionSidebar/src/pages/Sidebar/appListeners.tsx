import { commands } from 'aCommon/commands';
import { emptyResponse } from 'aCommon/extensionHelpers';
import { payloadRequest } from 'aCommon/requests';
import { extractUserData } from 'aNotion/services/notionCookies';

export const registerListener = () => {
   chrome.runtime.onMessage.addListener(async function (
      request: payloadRequest,
      sender,
      sendResponse
   ) {
      switch (request.command) {
         case commands.receivedCookies: {
            let cookie = request.payload as chrome.cookies.Cookie[];
            if (cookie != null) {
               extractUserData(cookie);
            }
            break;
         }
      }
      return emptyResponse(sendResponse);
   });
};
