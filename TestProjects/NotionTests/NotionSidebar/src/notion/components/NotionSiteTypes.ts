import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import { thunkStatus as ThunkStatus } from 'aNotion/types/thunkStatus';
import {
   Page,
   Collection,
   CollectionView,
} from 'aNotion/types/notionV3/notionBlockTypes';
import { PageRecordModel } from 'aNotion/types/PageRecord';

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
export type PageRecordState = {
   pageChunk?: PageChunk;
   status: ThunkStatus;
   pageRecord?: PageRecordModel;
};

export type SiteState = {
   cookie: CookieState;
   navigation: NavigationState;
   currentPageRecord: PageRecordState;
};
