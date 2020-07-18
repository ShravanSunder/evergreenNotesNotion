import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';
import { SearchRecord, SearchRecordModel } from 'aNotion/types/SearchRecord';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
//import { BlockRecord } from 'aNotion/types/PageRecord';

export type UnlinkedReferences = {
   references: SearchRecordModel[];
   blockLookup: any;
   titleLookup: any;
};
export type TitleLookup = {
   name: string;
   path: string[];
   blockId: string;
   blockType: BlockTypes;
};

enum resultTypeEnum {
   FullTitleMatch = 0,
   PartialTitleMatch = 1,
   BackLinkMatch = 2,
   RelatedSearch = 3,
}

export const createUnlinkedReferences = (
   query: string,
   titleSearch: SearchResultsType,
   backLinks: SearchResultsType,
   generalSearch: SearchResultsType,
   signal?: AbortSignal
): UnlinkedReferences | null => {
   let result: SearchRecord[] = [];

   for (let s of titleSearch.results) {
      try {
         if (s.score > 10 && s.highlight != null) {
            let data = new SearchRecord(titleSearch.recordMap, s);
         }
      } catch (err) {
         console.log(s);
         console.log(err);
      }
   }

   // for (let s of titleSearch.results) {
   //    try {
   //       if (s.score > 10 && s.highlight != null) {
   //          titleRefs.push(
   //             new SearchRecord(titleSearch.recordMap, s).toSerializable()
   //          );
   //       }
   //    } catch (err) {
   //       console.log(s);
   //       console.log(err);
   //    }
   // }

   return null;
};

const matchQuery = (data: SearchResultsType, results: any) => {};
