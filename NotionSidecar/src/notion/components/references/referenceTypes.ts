import { thunkStatus } from 'aNotion/types/thunkStatus';
import { SearchRecordModel } from 'aNotion/models/SearchRecord';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

export type ReferenceState = {
   pageReferences: searchReferences;
   pageReferencesStatus: thunkStatus;
   searchResults: searchReferences;
   resultResultsStatus: thunkStatus;
};

export type RefData = {
   searchRecord: SearchRecordModel;
   type: ResultTypeEnum;
};
export type searchReferences = {
   direct: RefData[];
   fullTitle: RefData[];
   related: RefData[];
};

export const initReferences = (): searchReferences => {
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
