import {
   thunkStatus,
   thunkStatus as ThunkStatus,
} from 'aNotion/types/thunkStatus';
import { ICurrentPageData } from 'aNotion/models/INotionPage';
import { updateStatus } from 'aNotion/types/updateStatus';

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
   currentPageData?: ICurrentPageData;
};

export type SidebarExtensionState = {
   cookie: { status: string; data?: CookieData };
   navigation: NavigationState;
   currentNotionPage: PageRecordState;
   status: SidebarExtensionStatus;
};

export type SidebarExtensionStatus = {
   webpageStatus: thunkStatus;
   updateReferences: updateStatus;
   updateMarks: updateStatus;
};
