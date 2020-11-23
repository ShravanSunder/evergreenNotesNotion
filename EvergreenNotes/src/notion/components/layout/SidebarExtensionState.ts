import {
   thunkStatus,
   thunkStatus as ThunkStatus,
} from 'aNotion/types/thunkStatus';
import { ICurrentPageData } from 'aNotion/models/INotionPage';
import { updateStatus } from 'aNotion/types/updateStatus';

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
   retryCounter: number;
};

export type SidebarExtensionState = {
   navigation: NavigationState;
   currentNotionPage: PageRecordState;
   status: SidebarExtensionStatus;
};

export type SidebarExtensionStatus = {
   notionWebpageLoadingStatus: thunkStatus;
   updateReferences: updateStatus;
   updateMarks: updateStatus;
};
