import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';
import { thunkStatus } from 'aNotion/typing/thunkStatus';

type UnlinkedRefs = {};

type SearchResultState = {
   status: thunkStatus;
   results?: SearchResultsType;
};

export type ReferenceState = {
   unlinkedRefs: UnlinkedRefs;
   searchResults: SearchResultState;
};
