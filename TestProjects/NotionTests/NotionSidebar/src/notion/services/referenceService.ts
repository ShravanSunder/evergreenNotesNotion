import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';

export const createUnlinkedReferences = (searchData: SearchResultsType) => {
   let results = {};
   console.log(searchData);
   for (let s of searchData.results) {
      let block = searchData.recordMap.block[s.id].value;
      console.log(block);
   }
};
