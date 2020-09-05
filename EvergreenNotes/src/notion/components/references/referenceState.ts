import { thunkStatus } from 'aNotion/types/thunkStatus';
import { SearchRecordModel } from 'aNotion/models/SearchRecord';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

export type ReferenceState = {
   pageReferences: SearchReferences;
   pageReferencesStatus: thunkStatus;
   searchQueries: string[];
};

export type RefData = {
   searchRecord: SearchRecordModel;
   type: ResultTypeEnum;
};
export type BacklinkData = {
   blockId: string;
   notionBlock: NotionBlockModel;
};

export type SearchReferences = {
   fullTitle: RefData[];
   related: RefData[];
};

export const defaultReferences = (): SearchReferences => {
   return {
      fullTitle: [],
      related: [],
   };
};

export enum ResultTypeEnum {
   FullTitleMatch = 0,
   DirectMatch = 1,
   RelatedSearch = 2,
}
