//make a way to get the page title and data
// doesn't matter if its a page or collection or whatever
// get title, properties etc.  using blocks as reference

import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import {
   NotionBlockFactory,
   NotionBlockModel,
} from 'aNotion/models/NotionBlock';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import {
   SemanticString,
   Bold,
   BasicStringFormatting,
} from 'aNotion/types/notionV3/typings/semantic_string';
// import {
//    Page,
//    Collection,
//    CollectionView,
// } from 'aNotion/types/notionV3/notionBlockTypes';

export const getBlockFromPageChunk = (
   page: PageChunk,
   pageId: string
): NotionBlockFactory => {
   try {
      let m = new NotionBlockFactory(page.recordMap, pageId);
      return m;
   } catch (err) {
      console.log(err);
      throw err;
   }
};

export const isNavigable = (block: NotionBlockModel): boolean => {
   return (
      block.type === BlockTypes.Page ||
      block.type === BlockTypes.CollectionViewPage
   );
};

export const flattenTitle = (titleArray: SemanticString[]) => {
   if (titleArray != null) {
      titleArray.map((ss) => {
         if (ss[1] == null) {
            return ss[0];
         } else {
            return '';
         }
      });
   }
   return '';
};

const isBold = (title: BasicStringFormatting[]) =>
   title.find((x) => {
      if ((x as Bold) != null) {
         return true;
      }
      return false;
   });
