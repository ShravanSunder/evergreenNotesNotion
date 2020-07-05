import { notionCookieActions } from 'aNotion/services/notionCookieSlice';
import { CookieData } from 'aNotion/services/NotionCookieTypes';
import { appDispatch } from 'aNotion/redux/reduxStore';
import { toGuid } from 'aCommon/extensionHelpers';

export const extractUserData = (cookies: chrome.cookies.Cookie[]) => {
   console.log(cookies);

   let spaceId = clean(
      cookies.find((f) => f.name === 'ajs_group_id')?.value as string
   );
   let userId = clean(
      cookies.find((f) => f.name === 'ajs_user_id')?.value as string
   );
   let token = cookies.find((f) => f.name === 'token_v2')?.value;
   let c = { spaceId, userId, token, cookies } as CookieData;

   appDispatch(notionCookieActions.loadCookies(c));
};

const clean = (str: string) => {
   return toGuid(
      str
         .replace('%22', '')
         .replace('%20', '')
         .replace('%22', '')
         .replace('%20', '')
         .trim()
   );
};
