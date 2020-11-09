import { thunkStatus as ThunkStatus } from 'aNotion/types/thunkStatus';
import { CurrentPageData } from 'aNotion/models/NotionPage';

export type CookieData = {
   token: string;
   cookies: chrome.cookies.Cookie[];
};

export type NavigationState = {
   pageId?: string;
   locationId?: string;
   backgroundId?: string;
   url?: string;
   notionSite?: string;
};
export type PageRecordState = {
   status: ThunkStatus;
   currentPageData?: CurrentPageData;
};

export type SiteState = {
   cookie: { status: string; data?: CookieData };
   navigation: NavigationState;
   currentPage: PageRecordState;
};
