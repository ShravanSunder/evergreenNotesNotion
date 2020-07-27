import { RecordMap, Record } from '../types/notionV3/notionRecordTypes';
import * as blockTypes from '../types/notionV3/notionBlockTypes';
import { BlockTypes, BlockProps } from '../types/notionV3/BlockTypes';
import TreeModel from 'tree-model';
import { BaseTextBlock } from '../types/notionV3/typings/basic_blocks';
import { NotionBlock } from 'aNotion/models/NotionBlock';

export const getContent = (
   record: RecordMap,
   blockId: string
): NotionBlock[] => {
   let node = record.block[blockId];
   let content: NotionBlock[] = [];
   if (node != null && node.value?.content != null) {
      content.concat(getNotionBlocksFromContent(node.value.content, record));
   }

   if (node != null && node.value?.type === BlockTypes.CollectionViewPage) {
      let colId = (node.value as blockTypes.CollectionViewPage).collection_id;
      if (record.collection != null) {
         //get parent block of collection
         let parentId = record.collection[colId].value?.parent_id;
         if (
            parentId != null &&
            record.block[parentId].value?.content != null
         ) {
            content.concat(
               getNotionBlocksFromContent(
                  record.block[parentId].value?.content!,
                  record
               )
            );
         }
      }
   }

   return content;
};

const getNotionBlocksFromContent = (
   contentIds: string[],
   record: RecordMap
) => {
   let content: NotionBlock[] = [];
   for (let childId of contentIds) {
      if (childId != null) {
         let cBlock = new NotionBlock(record, childId);
         content.push(cBlock);
      }
   }
   return content;
};