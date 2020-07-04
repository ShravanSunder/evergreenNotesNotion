import { commands } from 'aCommon/commands';
import { cookieActions } from 'aNotion/redux/cookieSlice';
import { CookieData } from 'aNotion/types/CookieData';
import { appDispatch } from 'aNotion/redux/reduxStore';

export const extractUserData = (cookies: chrome.cookies.Cookie[]) => {
   console.log(cookies);

   let spaceId = cookies.find((f) => f.name === 'ajs_group_id')?.value;
   let userId = cookies.find((f) => f.name === 'ajs_user_id')?.value;
   let token = cookies.find((f) => f.name === 'token_v2')?.value;
   let c = { spaceId, userId, token } as CookieData;

   appDispatch(cookieActions.loadCookies(c));
};
