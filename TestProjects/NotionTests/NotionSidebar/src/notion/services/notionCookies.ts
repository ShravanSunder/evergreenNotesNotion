import { commands } from 'aCommon/commands';
import reduxStore, { useAppDispatch } from 'aNotion/redux/reduxStore';
import { cookieActions } from 'aNotion/redux/cookieSlice';
import { CookieData } from 'aNotion/types/CookieData';

export const extractUserData = (cookies: chrome.cookies.Cookie[]) => {
   console.log(cookies);

   let spaceId = cookies.find((f) => f.name === 'ajs_group_id')?.value;
   let userId = cookies.find((f) => f.name === 'ajs_user_id')?.value;
   let token = cookies.find((f) => f.name === 'token_v2')?.value;
   let c = { spaceId, userId, token } as CookieData;

   reduxStore.dispatch(cookieActions.loadCookies(c));
};
