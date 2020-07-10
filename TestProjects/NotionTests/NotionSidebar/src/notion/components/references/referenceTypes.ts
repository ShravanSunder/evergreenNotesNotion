import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { SearchRecordModel } from 'aNotion/types/SearchRecord';

type UnlinkedReferences = {
   status: thunkStatus;
   results?: SearchRecordModel;
};

export type ReferenceState = {
   unlinkedReferences: UnlinkedReferences;
};
