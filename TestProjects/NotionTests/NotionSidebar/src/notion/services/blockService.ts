//make a way to get the page title and data
// doesn't matter if its a page or collection or whatever
// get title, properties etc.  using blocks as reference

import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import { PageRecord, PageRecordModel } from 'aNotion/types/PageRecord';
// import {
//    Page,
//    Collection,
//    CollectionView,
// } from 'aNotion/types/notionV3/notionBlockTypes';

export const getPageRecordFromChunk = (
   page: PageChunk,
   pageId: string
): PageRecordModel => {
   let m = new PageRecord(page.recordMap, pageId).toSerializable();
   return m;
};

export const getTitleForPageRecord = (record: PageRecord) => {};
