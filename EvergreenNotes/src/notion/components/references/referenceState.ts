import { thunkStatus } from 'aNotion/types/thunkStatus';
import { SearchRecordModel } from 'aNotion/models/SearchRecord';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

export type ReferenceState = {
   pageReferences: SearchReferences;
   pageReferencesStatus: thunkStatus;
   searchQueries: string[];
   // searchResults: SearchReferences;
   // searchResultsStatus: thunkStatus;
};

export type RefData = {
   searchRecord: SearchRecordModel;
   type: ResultTypeEnum;
};
export type SearchReferences = {
   direct: RefData[];
   fullTitle: RefData[];
   related: RefData[];
};

export const defaultReferences = (): SearchReferences => {
   return {
      direct: [],
      fullTitle: [],
      related: [],
   };
};

export enum ResultTypeEnum {
   FullTitleMatch = 0,
   DirectMatch = 1,
   RelatedSearch = 2,
}
