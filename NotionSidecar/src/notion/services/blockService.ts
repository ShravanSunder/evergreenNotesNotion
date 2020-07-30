//make a way to get the page title and data
// doesn't matter if its a page or collection or whatever
// get title, properties etc.  using blocks as reference

import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import { NotionBlock, NotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
// import {
//    Page,
//    Collection,
//    CollectionView,
// } from 'aNotion/types/notionV3/notionBlockTypes';

export const getBlockFromPageChunk = (
   page: PageChunk,
   pageId: string
): NotionBlock => {
   try {
      let m = new NotionBlock(page.recordMap, pageId);
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
