//make a way to get the page title and data
// doesn't matter if its a page or collection or whatever
// get title, properties etc.  using blocks as reference

import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import { Page } from 'aNotion/types/notionV3/notionBlockTypes';

export const pageBlockFromChunk = (page: PageChunk, pageId: string): Page => {
   let block = page.recordMap.block[pageId].value as Page;
   console.log(block);
   return block;
};
