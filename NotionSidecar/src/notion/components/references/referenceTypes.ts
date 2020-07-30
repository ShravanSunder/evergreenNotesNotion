import { thunkStatus } from 'aNotion/types/thunkStatus';
import { SearchRecordModel } from 'aNotion/models/SearchRecord';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

export type ReferenceState = {
   pageReferences: PageReferences;
   status: thunkStatus;
};

export type RefData = {
   searchRecord: SearchRecordModel;
   type: ResultTypeEnum;
};
export type PageReferences = {
   direct: RefData[];
   fullTitle: RefData[];
   related: RefData[];
};

export const initPageReference = (): PageReferences => {
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
