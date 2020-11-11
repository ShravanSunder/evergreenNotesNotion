import {
   thunkStatus,
   thunkStatus as ThunkStatus,
} from 'aNotion/types/thunkStatus';
import { CurrentPageData } from 'aNotion/models/NotionPage';

export type CookieData = {
   token: string;
   cookies: chrome.cookies.Cookie[];
};

// location of the notion site
export type NavigationState = {
   pageId?: string;
   locationId?: string;
   backgroundId?: string;
   url?: string;
   notionSite?: string;
   spaceId?: string;
};
export type PageRecordState = {
   status: ThunkStatus;
   currentPageData?: CurrentPageData;
};

export type SidebarExtensionState = {
   cookie: { status: string; data?: CookieData };
   navigation: NavigationState;
   currentNotionPage: PageRecordState;
   sidebarStatus: {
      webpageStatus: thunkStatus;
      updateReferences: boolean;
      updateMarks: boolean;
   };
};
