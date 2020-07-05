import { PageChunk } from 'aNotion/typing/notionApi_V3/page';

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
   status: thunkStatus;
};

export type PageState = {
   cookie: CookieState;
   navigation: NavigationState;
   currentPage: CurrentPageState;
};
