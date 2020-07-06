import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';

export const createUnlinkedReferences = (searchData: SearchResultsType) => {
   let results = {};
   for (let s of searchData.results) {
      let block = searchData.recordMap.block[s.id];
      let value = block.created_time;
   }
};
