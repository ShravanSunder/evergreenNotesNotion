import { thunkStatus as ThunkStatus } from 'aNotion/types/thunkStatus';
import { CurrentPage } from 'aNotion/models/NotionPage';

export type CookieData = {
   userId: string;
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
   currentPage?: CurrentPage;
};

export type SiteState = {
   cookie: { status: string; data?: CookieData };
   navigation: NavigationState;
   currentPage: PageRecordState;
};
