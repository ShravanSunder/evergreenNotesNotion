import { PageChunk } from 'aNotion/typing/notionApi_v3/notionRecordTypes';
import { thunkStatus as ThunkStatus } from 'aNotion/typing/thunkStatus';
import { Page } from 'aNotion/typing/notionApi_v3/notionBlockTypes';

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
   pageChunk?: PageChunk;
   status: ThunkStatus;
   pageBlock?: Page;
};

export type SiteState = {
   cookie: CookieState;
   navigation: NavigationState;
   currentPage: CurrentPageState;
};
