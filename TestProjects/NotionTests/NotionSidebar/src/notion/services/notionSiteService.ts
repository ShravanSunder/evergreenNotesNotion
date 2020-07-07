import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import {
   CookieData,
   NavigationState,
} from 'aNotion/components/NotionSiteTypes';
import { appDispatch } from 'aNotion/redux/reduxStore';
import { toGuid } from 'aCommon/extensionHelpers';
import * as queryString from 'query-string';

export const extractUserData = (cookies: chrome.cookies.Cookie[]) => {
   console.log(cookies);

   let spaceId = cleanValue(
      cookies.find((f) => f.name === 'ajs_group_id')?.value as string
   );
   let userId = cleanValue(
      cookies.find((f) => f.name === 'ajs_user_id')?.value as string
   );
   let token = cookies.find((f) => f.name === 'token_v2')?.value;
   let c = { spaceId, userId, token, cookies } as CookieData;

   appDispatch(notionSiteActions.loadCookies(c));
};

const cleanValue = (str: string) => {
   return toGuid(
      str
         .replace('%22', '')
         .replace('%20', '')
         .replace('%22', '')
         .replace('%20', '')
         .trim()
   );
};

export const extractNavigationData = (
   url: string | undefined
): NavigationState => {
   let result: NavigationState = {};
   if (url === undefined || url == null) {
      console.log("error: can't get page");
   } else {
      let data = queryString.parseUrl(url, { parseFragmentIdentifier: true });
      result.locationId = data.fragmentIdentifier;
      if (data.query?.p != null) {
         result.pageId = toGuid(data.query.p as string);
         result.backgroundId = getGuidFromUrl(data.url);
      } else {
         result.pageId = getGuidFromUrl(data.url);
         result.backgroundId = undefined;
      }
      console.log(result);
   }
   return result;
};

const getGuidFromUrl = (url: string): string => {
   let guid = url.slice(url.length - 32);
   return toGuid(guid.trim());
};
