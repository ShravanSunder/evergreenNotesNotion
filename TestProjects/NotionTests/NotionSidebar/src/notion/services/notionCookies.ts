import { cookieActions } from 'aNotion/redux/cookieSlice';
import { CookieData } from 'aNotion/types/CookieData';
import { appDispatch, getAppState } from 'aNotion/redux/reduxStore';
import { cookieSelector } from 'aNotion/redux/rootReducer';
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

   appDispatch(cookieActions.loadCookies(c));
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
