import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';
import { SearchRecord, SearchRecordModel } from 'aNotion/types/SearchRecord';

export const createUnlinkedReferences = (
   searchData: SearchResultsType
): SearchRecordModel[] => {
   let results: SearchRecordModel[] = [];
   for (let s of searchData.results) {
      results.push(new SearchRecord(searchData.recordMap, s).toSerializable());
   }
   return results;
};
