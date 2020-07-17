import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import { thunkStatus as ThunkStatus } from 'aNotion/types/thunkStatus';
import {
   Page,
   Collection,
   CollectionView,
} from 'aNotion/types/notionV3/notionBlockTypes';
import { NotionBlockModel } from 'aNotion/types/NotionBlock';

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
};
export type PageRecordState = {
   pageChunk?: PageChunk;
   status: ThunkStatus;
   pageRecord?: NotionBlockModel;
};

export type SiteState = {
   cookie: CookieState;
   navigation: NavigationState;
   currentPageRecord: PageRecordState;
};
