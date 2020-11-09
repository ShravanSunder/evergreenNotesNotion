import { thunkStatus } from 'aNotion/types/thunkStatus';
import { SearchRecordModel } from 'aNotion/models/SearchRecord';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

export type ReferenceState = {
   pageReferences: PageReferences;
   pageReferencesStatus: thunkStatus;
   //this is a history of search queries, should be moved
   searchQueries: string[];
};

export type PageReferences = {
   backlinks: BacklinkRecordModel[];
   references: SearchReferences;
   relations: NotionBlockModel[];
   pageId?: string;
};

export type BacklinkRecordModel = {
   backlinkBlock: NotionBlockModel;
   path: NotionBlockModel[];
};

export type SearchReferences = {
   fullTitle: SearchRecordModel[];
   related: SearchRecordModel[];
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
