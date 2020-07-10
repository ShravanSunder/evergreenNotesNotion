import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { SearchRecordModel } from 'aNotion/types/SearchRecord';
import { UnlinkedReferences } from 'aNotion/services/referenceService';

type UnlinedReferenceState = {
   status: thunkStatus;
   results?: UnlinkedReferences;
};

export type ReferenceState = {
   unlinkedReferences: UnlinedReferenceState;
};
