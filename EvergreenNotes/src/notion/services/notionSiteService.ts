import {
   NavigationState,
   SidebarExtensionStatus,
} from 'aNotion/components/layout/SidebarExtensionState';
import { appDispatch, getAppState } from 'aNotion/providers/appDispatch';
import { isGuid, isGuidOnlyNumbers, toGuid } from 'aCommon/extensionHelpers';
import * as queryString from 'query-string';
import { sidebarExtensionSelector } from 'aNotion/providers/storeSelectors';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { updateStatus } from 'aNotion/types/updateStatus';

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
         extractPageAndBackgroundIfValid(data, result);
      } else {
         extractPageIfValid(data, result);
      }
      result.url = url;
      result.notionSite = extractNotionSiteUrl(url);
   } else {
      console.log('error: not notion page');
   }
   return result;
};

const extractNotionSiteUrl = (url: string): string => {
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
   const sidebar = getAppState(sidebarExtensionSelector);
   return sidebar.navigation.notionSite + pageId.replace(/-/g, '');
};

export const getSiteUrl = () => {
   const sidebar = getAppState(sidebarExtensionSelector);
   return sidebar.navigation.notionSite;
};

function extractPageIfValid(
   data: queryString.ParsedUrl,
   result: NavigationState
) {
   if (isGuid(getGuidFromUrl(data.url))) {
      result.pageId = getGuidFromUrl(data.url);
      result.backgroundId = undefined;
   } else {
      result.pageId = undefined;
      result.backgroundId = undefined;
   }
}

const extractPageAndBackgroundIfValid = (
   data: queryString.ParsedUrl,
   result: NavigationState
) => {
   if (isGuidOnlyNumbers(data.query.p as string)) {
      result.pageId = toGuid(data.query.p as string);
      result.backgroundId = getGuidFromUrl(data.url);
   } else {
      result.pageId = undefined;
      result.backgroundId = undefined;
   }
};

export const calculateSidebarStatus = (status: SidebarExtensionStatus) => {
   if (status.notionWebpageLoadingStatus !== thunkStatus.fulfilled) {
      return status.notionWebpageLoadingStatus;
   } else {
      if (
         status.updateReferences !== updateStatus.shouldUpdate &&
         status.updateReferences !== updateStatus.waiting &&
         status.updateMarks != updateStatus.waiting &&
         status.updateMarks != updateStatus.shouldUpdate
      ) {
         return thunkStatus.fulfilled;
      }

      return thunkStatus.pending;
   }
};

export const calculateShouldUpdateStatus = (status: updateStatus) => {
   if (
      status === updateStatus.waiting ||
      status === updateStatus.updateFailed ||
      status === updateStatus.shouldUpdate
   ) {
      return true;
   }

   return false;
};
