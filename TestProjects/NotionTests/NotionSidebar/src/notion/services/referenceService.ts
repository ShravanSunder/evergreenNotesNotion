import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';
import { SearchRecord, SearchRecordModel } from 'aNotion/types/SearchRecord';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import {
   PageReferences,
   Reference,
   ResultTypeEnum,
} from 'aNotion/components/references/referenceTypes';
//import { BlockRecord } from 'aNotion/types/PageRecord';

export const createUnlinkedReferences = (
   query: string,
   searchResults: SearchResultsType,
   signal?: AbortSignal
): PageReferences => {
   let direct: Reference[] = [];
   let fullTitle: Reference[] = [];
   let related: Reference[] = [];

   for (let s of searchResults.results) {
      try {
         if (s.score > 10 && s.highlight != null && s.highlight.text != null) {
            let data = new SearchRecord(searchResults.recordMap, s);
            filterResults(data, query, direct, fullTitle, related);
         }
      } catch (err) {
         console.log(s);
         console.log(err);
      }
   }

   related = related
      .sort((x, y) => y.reference.score - x.reference.score)
      .slice(0, 10);
   direct = direct.sort((x, y) => y.reference.score - x.reference.score);

   return {
      direct: direct,
      related: related,
      fullTitle: fullTitle,
   };
};

const filterResults = (
   data: SearchRecord,
   query: string,
   directResults: Reference[],
   fullTitle: Reference[],
   relatedResults: Reference[]
) => {
   let full = new RegExp(query, 'i');
   let backlink = new RegExp('[[' + query + ']]', 'i');
   if (backlink.test(data.highlight.pureText!)) {
      if (!directResults.find((x) => x.reference.id === data.id)) {
         directResults.push({
            reference: data,
            type: ResultTypeEnum.DirectMatch,
         });
      }
   } else if (full.test(data.highlight.pureText!)) {
      if (!fullTitle.find((x) => x.reference.id === data.id)) {
         fullTitle.push({
            reference: data,
            type: ResultTypeEnum.FullTitleMatch,
         });
      }
   } else {
      if (
         !directResults.find((x) => x.reference.id === data.id) &&
         !fullTitle.find((x) => x.reference.id === data.id) &&
         !relatedResults.find((x) => x.reference.id === data.id)
      ) {
         relatedResults.push({
            reference: data,
            type: ResultTypeEnum.RelatedSearch,
         });
      }
   }
};
