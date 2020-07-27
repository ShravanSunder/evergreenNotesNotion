//make a way to get the page title and data
// doesn't matter if its a page or collection or whatever
// get title, properties etc.  using blocks as reference

import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import { NotionBlock, NotionBlockModel } from 'aNotion/models/NotionBlock';
// import {
//    Page,
//    Collection,
//    CollectionView,
// } from 'aNotion/types/notionV3/notionBlockTypes';

export const getBlockFromPageChunk = (
   page: PageChunk,
   pageId: string
): NotionBlockModel => {
   try {
      let m = new NotionBlock(page.recordMap, pageId).toSerializable();
      return m;
   } catch (err) {
      console.log(err);
      throw err;
   }
};
