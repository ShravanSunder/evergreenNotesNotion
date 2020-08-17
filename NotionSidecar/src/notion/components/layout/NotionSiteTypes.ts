import { thunkStatus as ThunkStatus } from 'aNotion/types/thunkStatus';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

export type CookieData = {
   userId: string;
   token: string;
   spaceId: string;
   cookies: chrome.cookies.Cookie[];
};

export type CookieState = { status: string; data?: CookieData };
export type NavigationState = {
   pageId?: string;
   locationId?: string;
   backgroundId?: string;
   url?: string;
   notionSite?: string;
};
export type PageRecordState = {
   status: ThunkStatus;
   pageRecord?: NotionBlockModel;
   //users:
};

export type SiteState = {
   cookie: CookieState;
   navigation: NavigationState;
   currentPageRecord: PageRecordState;
};
