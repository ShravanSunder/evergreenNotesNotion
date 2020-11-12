import { commands } from 'aCommon/commands';
import { emptyResponse } from 'aCommon/extensionHelpers';
import { payloadRequest } from 'aCommon/commands';
import { CookieData } from 'aNotion/components/layout/SidebarExtensionState';
import { appDispatch } from 'aNotion/providers/appDispatch';
import { sidebarExtensionActions } from 'aNotion/components/layout/sidebarExtensionSlice';

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
         return true;
      }
   );
};

export const extractUserData = (cookies: chrome.cookies.Cookie[]) => {
   let token = cookies.find((f) => f.name === 'token_v2')?.value;
   let c = { token, cookies } as CookieData;

   appDispatch(sidebarExtensionActions.loadCookies(c));
};
