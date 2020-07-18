import { thunkStatus } from 'aNotion/types/thunkStatus';
import { SearchRecordModel } from 'aNotion/types/SearchRecord';

export type ReferenceState = {
   pageReferences: PageReferences;
   status: thunkStatus;
};

export type Reference = {
   reference: SearchRecordModel;
   type: ResultTypeEnum;
};
export type PageReferences = {
   direct: Reference[];
   fullTitle: Reference[];
   related: Reference[];
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
