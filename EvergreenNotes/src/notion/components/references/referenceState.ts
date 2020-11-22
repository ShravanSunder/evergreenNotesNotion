import { thunkStatus } from 'aNotion/types/thunkStatus';
import { ISearchRecordModel } from 'aNotion/models/SearchRecord';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';

export type ReferenceState = {
   pageReferences: PageReferences;
   status: thunkStatus;

   //this is a history of search queries, should be moved
   searchQueries: string[];
};

export type PageReferences = {
   backlinks: BacklinkRecordModel[];
   references: SearchReferences;
   relations: INotionBlockModel[];
   pageId?: string;
   pageName?: string;
};

export type BacklinkRecordModel = {
   backlinkBlock: INotionBlockModel;
   path: INotionBlockModel[];
};

export type SearchReferences = {
   fullTitle: ISearchRecordModel[];
   related: ISearchRecordModel[];
};

export const defaultPageReferences = (): PageReferences => {
   return {
      backlinks: [],
      references: defaultSearchReferences(),
      relations: [],
   };
};

export const defaultSearchReferences = (): SearchReferences => {
   return {
      fullTitle: [],
      related: [],
   };
};
