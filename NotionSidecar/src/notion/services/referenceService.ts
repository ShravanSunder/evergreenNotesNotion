import { SearchResultsType } from 'aNotion/api/v3/apiReqTypes';
import { SearchRecord, SearchRecordModel } from 'aNotion/models/SearchRecord';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import {
   PageReferences,
   RefData,
   ResultTypeEnum,
} from 'aNotion/components/references/referenceTypes';
import { current } from '@reduxjs/toolkit';
//import { BlockRecord } from 'aNotion/types/PageRecord';

export const createReferences = (
   query: string,
   searchResults: SearchResultsType,
   pageId: string | undefined
   //signal?: AbortSignal
): PageReferences => {
   let direct: RefData[] = [];
   let fullTitle: RefData[] = [];
   let related: RefData[] = [];

   for (let s of searchResults.results) {
      try {
         if (
            s.score > 10 &&
            s.highlight != null &&
            s.highlight.text != null &&
            s.id != pageId
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
      .slice(0, 10);
   direct = direct.sort((x, y) => y.searchRecord.score - x.searchRecord.score);

   console.log(direct);
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
      if (!directResults.find((x) => x.searchRecord.id === data.id)) {
         directResults.push({
            searchRecord: data.toSerializable(),
            type: ResultTypeEnum.DirectMatch,
         });
      }
   } else if (full.test(data.text!)) {
      if (!fullTitle.find((x) => x.searchRecord.id === data.id)) {
         fullTitle.push({
            searchRecord: data.toSerializable(),
            type: ResultTypeEnum.FullTitleMatch,
         });
      }
   } else {
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
   }
};
