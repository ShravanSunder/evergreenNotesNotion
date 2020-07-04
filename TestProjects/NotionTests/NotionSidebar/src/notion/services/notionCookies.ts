import { commands } from 'aCommon/commands';
import reduxStore from 'aNotion/redux/reduxStore';
import { cookieActions } from 'aNotion/redux/cookieSlice';

export async function receivedCookies(request: any) {}

export const extractUserData = (cookies: chrome.cookies.Cookie[]) => {
   console.log(cookies);
   let spaceId = cookies.find((f) => f.name === 'ajs_group_id');
   let token = cookies.find((f) => f.name === 'token_v2');
   // reduxStore.dispatch(cookieActions.saveCookieData({ cookies }));
};
