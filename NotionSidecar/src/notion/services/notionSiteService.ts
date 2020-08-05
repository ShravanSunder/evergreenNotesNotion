import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import {
   CookieData,
   NavigationState,
} from 'aNotion/components/NotionSiteTypes';
import { appDispatch, getAppState } from 'aNotion/providers/reduxStore';
import { toGuid } from 'aCommon/extensionHelpers';
import * as queryString from 'query-string';
import { navigationSelector } from 'aNotion/providers/storeSelectors';

export const extractUserData = (cookies: chrome.cookies.Cookie[]) => {
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
   if (url == null) {
      console.log("error: can't get page");
   } else if (isNotionUrl(url)) {
      let data = queryString.parseUrl(url, { parseFragmentIdentifier: true });
      result.locationId = data.fragmentIdentifier;
      if (data.query?.p != null) {
         result.pageId = toGuid(data.query.p as string);
         result.backgroundId = getGuidFromUrl(data.url);
      } else {
         result.pageId = getGuidFromUrl(data.url);
         result.backgroundId = undefined;
      }
      result.url = url;
      result.notionSite = getNotionSiteUrl(url);
   } else {
      console.log('error: not notion page');
   }
   return result;
};

const getNotionSiteUrl = (url: string): string => {
   let segments = url.split('/');
   let length = segments.length;
   let result = segments.reduce(
      (accumulator: string, value: string, index: number) => {
         if (index < length - 1 && value !== 'https') {
            return accumulator + '/' + value;
         }
         return accumulator;
      }
   );

   return result.trim() + '/';
};

const getGuidFromUrl = (url: string): string => {
   let guid = url.slice(url.length - 32);
   return toGuid(guid.trim());
};

const isNotionUrl = (url: string) => {
   let urlRegex = /^https?:\/\/(?:[^./?#]+\.)?notion.so/;
   if (url != null) {
      if (urlRegex.test(url)) {
         return true;
      }
   }
   return false;
};

export const getPageUrl = (pageId: string) => {
   const navigation = getAppState(navigationSelector);
   return navigation.notionSite + pageId.replace(/-/g, '');
};
