import {
   SearchResultsType,
   SearchSort,
   BacklinkRecordType,
} from 'aNotion/api/v3/apiRequestTypes';
import { SearchRecord, SearchRecordModel } from 'aNotion/models/SearchRecord';
import {
   SearchReferences,
   defaultSearchReferences,
   BacklinkRecordModel,
} from 'aNotion/components/references/referenceState';
import * as searchApi from 'aNotion/api/v3/searchApi';
import {
   NotionBlockRecord,
   NotionBlockModel,
} from 'aNotion/models/NotionBlock';
import { getPropertiesWithSemanticFormat } from './pageService';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

import * as blockService from 'aNotion/services/blockService';

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
   if (result1 != null && abort?.signal.aborted !== true) {
      return processSearchResults(query, result1, undefined, undefined);
   }

   return defaultSearchReferences();
};

export const processSearchResults = (
   query: string,
   searchResults: SearchResultsType,
   pageId: string | undefined,
   excludedBlockIds: string[] = [],
   searchLimit: number = 20
): SearchReferences => {
   let fullTitle: SearchRecordModel[] = [];
   let related: SearchRecordModel[] = [];

   for (let s of searchResults.results) {
      try {
         if (
            s.score > 10 &&
            s.highlight != null &&
            s.highlight.text != null &&
            s.id !== pageId &&
            !excludedBlockIds.some((e) => e === s.id)
         ) {
            let data = new SearchRecord(searchResults.recordMap, s);
            filterSearchResults(data, query, fullTitle, related);
         }
      } catch (err) {
         console.log(s);
         console.log(err);
      }
   }

   related = related.sort((x, y) => y.score - x.score).slice(0, searchLimit);
   fullTitle = fullTitle.sort((x, y) => y.score - x.score);

   return {
      related: related,
      fullTitle: fullTitle,
   };
};

const filterSearchResults = (
   data: SearchRecord,
   query: string,
   fullTitle: SearchRecordModel[],
   relatedResults: SearchRecordModel[]
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
   fullTitle: SearchRecordModel[],
   relatedResults: SearchRecordModel[]
) => {
   if (
      !fullTitle.find((x) => x.id === data.id) &&
      !relatedResults.find((x) => x.id === data.id)
   ) {
      relatedResults.push(data.toSerializable());
   }
};

const pushFullTextResults = (
   fullTitle: SearchRecordModel[],
   data: SearchRecord
) => {
   if (!fullTitle.find((x) => x.id === data.id)) {
      fullTitle.push(data.toSerializable());
   }
};

export const processBacklinks = (
   backlinksRecords: BacklinkRecordType
): BacklinkRecordModel[] => {
   let backlinkData: BacklinkRecordModel[] = [];

   //log unkown backlinks for now
   backlinksRecords.backlinks
      .filter(
         (f) =>
            f.mentioned_from.type !== 'collection_reference' &&
            f.mentioned_from.type !== 'property_mention'
      )
      .forEach((f) => {
         console.log(f);
      });

   backlinksRecords.backlinks
      .filter((f) => f.mentioned_from.type !== 'collection_reference')
      .forEach((b) => {
         const rec = new NotionBlockRecord(
            backlinksRecords.recordMap,
            b.mentioned_from.block_id
         );

         if (rec.blockId != null && rec.block != null) {
            backlinkData.push({
               backlinkBlock: rec.toSerializable(),
               path: rec
                  .getParentsNodes()
                  .map((m) => (m as NotionBlockRecord).toSerializable()),
            });
         }
      });

   return backlinkData;
};

export const getRelationsForPage = async (
   pageBlock: NotionBlockModel | undefined,
   signal: AbortSignal
): Promise<NotionBlockModel[]> => {
   if (pageBlock == null) {
      return [];
   }

   let relatedIds = getPropertiesWithSemanticFormat(
      pageBlock,
      SemanticFormatEnum.Page
   );

   const [records, chunk] = await blockService.syncBlockRecords(
      relatedIds,
      signal
   );
   let relations = records.map((m) => m.toSerializable());
   return relations;
};
