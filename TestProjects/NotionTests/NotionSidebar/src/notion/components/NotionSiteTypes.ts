import { PageChunk } from 'aNotion/typing/notionApi_V3/page';
import { thunkStatus as ThunkStatus } from 'aNotion/typing/thunkStatus';

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
};
export type CurrentPageState = {
   page?: PageChunk;
   status: ThunkStatus;
};

export type SiteState = {
   cookie: CookieState;
   navigation: NavigationState;
   currentPage: CurrentPageState;
};
