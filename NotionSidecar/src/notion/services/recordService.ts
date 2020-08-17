import { RecordMap, Record } from '../types/notionV3/notionRecordTypes';
import * as blockTypes from '../types/notionV3/notionBlockTypes';
import { BlockTypes, BlockProps } from '../types/notionV3/BlockTypes';
import {
   NotionBlockRecord,
   NotionBlockModel,
} from 'aNotion/models/NotionBlock';

export const getContent = (
   record: RecordMap,
   blockId: string
): NotionBlockModel[] => {
   let node = record.block[blockId];
   let content: NotionBlockModel[] = [];
   if (node != null && node.value?.content != null) {
      let c = getNotionBlocksFromContent(node.value.content, record);
      content = content.concat(c);
   }

   if (node != null && node.value?.type === BlockTypes.CollectionViewPage) {
      let colId = (node.value as blockTypes.CollectionViewPage).collection_id;
      if (record.collection != null) {
         //get parent block of collection
         let parentId = record.collection[colId].value?.parent_id;
         if (
            parentId != null &&
            record?.block?.[parentId].value?.content != null
         ) {
            let c = getNotionBlocksFromContent(
               record.block[parentId].value?.content!,
               record
            );
            content = content.concat(c);
         }
      }
   }

   return content;
};

const getNotionBlocksFromContent = (
   contentIds: string[],
   record: RecordMap
) => {
   let content: NotionBlockModel[] = [];
   for (let childId of contentIds) {
      if (childId != null) {
         let cBlock = new NotionBlockRecord(record, childId);
         if (cBlock.type !== BlockTypes.Unknown) {
            content.push(cBlock.toSerializable());
         }
      }
   }
   return content;
};
