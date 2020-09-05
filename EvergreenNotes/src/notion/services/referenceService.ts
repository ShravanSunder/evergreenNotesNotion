import {
   SearchResultsType,
   SearchSort,
   BacklinkRecordType,
} from 'aNotion/api/v3/apiRequestTypes';
import { SearchRecord, SearchRecordModel } from 'aNotion/models/SearchRecord';
import {
   SearchReferences,
   RefData,
   ResultTypeEnum,
   defaultReferences,
} from 'aNotion/components/references/referenceState';
import * as searchApi from 'aNotion/api/v3/searchApi';

export const searchNotion = async (
   query: string,
   abort: AbortController | undefined = undefined
) => {
   let result1 = await searchApi.searchByRelevance(
      query,
      false,
      50,
      SearchSort.Relevance,
      abort?.signal
   );
   if (result1 != null) {
      //&& !abort.signal.aborted) {
      return createReferences(query, result1, undefined, undefined);
   }

   return defaultReferences();
};

export const createReferences = (
   query: string,
   searchResults: SearchResultsType,
   pageId: string | undefined,
   searchLimit: number = 20
   //signal?: AbortSignal
): SearchReferences => {
   let fullTitle: RefData[] = [];
   let related: RefData[] = [];

   for (let s of searchResults.results) {
      try {
         if (
            s.score > 10 &&
            s.highlight != null &&
            s.highlight.text != null &&
            s.id !== pageId
         ) {
            let data = new SearchRecord(searchResults.recordMap, s);
            filterSearchResults(data, query, fullTitle, related);
         }
      } catch (err) {
         console.log(s);
         console.log(err);
      }
   }

   related = related
      .sort((x, y) => y.searchRecord.score - x.searchRecord.score)
      .slice(0, searchLimit);
   fullTitle = fullTitle.sort(
      (x, y) => y.searchRecord.score - x.searchRecord.score
   );

   return {
      related: related,
      fullTitle: fullTitle,
   };
};

const filterSearchResults = (
   data: SearchRecord,
   query: string,
   fullTitle: RefData[],
   relatedResults: RefData[]
) => {
   let full = new RegExp(query, 'i');
   if (full.test(data.text!)) {
      pushFullTextResults(fullTitle, data);
   } else {
      pushRelatedResults(data, fullTitle, relatedResults);
   }
};
const pushRelatedResults = (
   data: SearchRecord,
   fullTitle: RefData[],
   relatedResults: RefData[]
) => {
   if (
      !fullTitle.find((x) => x.searchRecord.id === data.id) &&
      !relatedResults.find((x) => x.searchRecord.id === data.id)
   ) {
      relatedResults.push({
         searchRecord: data.toSerializable(),
         type: ResultTypeEnum.RelatedSearch,
      });
   }
};

const pushFullTextResults = (fullTitle: RefData[], data: SearchRecord) => {
   if (!fullTitle.find((x) => x.searchRecord.id === data.id)) {
      fullTitle.push({
         searchRecord: data.toSerializable(),
         type: ResultTypeEnum.FullTitleMatch,
      });
   }
};
