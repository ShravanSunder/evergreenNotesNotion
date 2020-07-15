import { SearchResultsType } from 'aNotion/api/v3/SearchApiTypes';
import { SearchRecord, SearchRecordModel } from 'aNotion/types/SearchRecord';
import { BlockNames } from 'aNotion/types/notionV3/BlockEnums';
import { PageRecord } from 'aNotion/types/PageRecord';

export type UnlinkedReferences = {
   references: SearchRecordModel[];
   blockLookup: any;
   titleLookup: any;
};
export type TitleLookup = {
   name: string;
   path: string[];
   blockId: string;
   blockType: BlockNames;
};

export const createUnlinkedReferences = (
   searchData: SearchResultsType
): UnlinkedReferences => {
   let references: SearchRecordModel[] = [];

   for (let s of searchData.results) {
      try {
         if (s.score > 10 && s.highlight != null) {
            references.push(
               new SearchRecord(searchData.recordMap, s).toSerializable()
            );
         }
      } catch (err) {
         console.log(s);
         console.log(err);
      }
   }
   // let recordArray: PageRecord[] = [];

   // for (let key of Object.keys(searchData.recordMap.block)) {
   //    let block = searchData.recordMap.block[key];
   //    recordArray.push(new PageRecord(searchData.recordMap, key));
   // }

   // //minimum score and maybe a top

   // for (let r of references) {
   //    let p = r.highlight.pathText.replace(r.highlight.text, '');
   //    let matches = recordArray.find((x) => {
   //       if (x.blockId !== r.id) {
   //          return p.includes(x.getName()!);
   //       }
   //       return false;
   //    });
   //    //finish later
   // }

   return {
      references: references,
      blockLookup: {},
      titleLookup: {},
   };
};
