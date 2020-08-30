import { SearchResultsType, SearchSort } from 'aNotion/api/v3/apiRequestTypes';
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
      return createReferences(query, result1, undefined);
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
   let direct: RefData[] = [];
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
            filterResults(data, query, direct, fullTitle, related);
         }
      } catch (err) {
         console.log(s);
         console.log(err);
      }
   }

   related = related
      .sort((x, y) => y.searchRecord.score - x.searchRecord.score)
      .slice(0, searchLimit);
   direct = direct.sort((x, y) => y.searchRecord.score - x.searchRecord.score);

   return {
      direct: direct,
      related: related,
      fullTitle: fullTitle,
   };
};

const filterResults = (
   data: SearchRecord,
   query: string,
   directResults: RefData[],
   fullTitle: RefData[],
   relatedResults: RefData[]
) => {
   let full = new RegExp(query, 'i');
   let backlink = new RegExp('[[' + query + ']]', 'i');
   if (backlink.test(data.text!)) {
      pushDirectResults(directResults, data);
   } else if (full.test(data.text!)) {
      pushFullTextResults(fullTitle, data);
   } else {
      pushRelatedResults(directResults, data, fullTitle, relatedResults);
   }
};
const pushRelatedResults = (
   directResults: RefData[],
   data: SearchRecord,
   fullTitle: RefData[],
   relatedResults: RefData[]
) => {
   if (
      !directResults.find((x) => x.searchRecord.id === data.id) &&
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

const pushDirectResults = (directResults: RefData[], data: SearchRecord) => {
   if (!directResults.find((x) => x.searchRecord.id === data.id)) {
      directResults.push({
         searchRecord: data.toSerializable(),
         type: ResultTypeEnum.DirectMatch,
      });
   }
};
