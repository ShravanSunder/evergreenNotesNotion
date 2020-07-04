import { commands } from 'aCommon/commands';

export async function receivedCookies(request: any) {}

export const extractUserData = (cookies: chrome.cookies.Cookie[]) => {
   console.log(cookies);
};

chrome.runtime.onMessage.addListener(async function(
   request,
   sender,
   sendResponse
) {
   switch (request.command) {
      case commands.receivedCookies: {
         extractUserData(request.cookies);
         break;
      }
   }
});
