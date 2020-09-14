import {
   RecordMap,
   Record,
   PageChunk,
} from 'aNotion/types/notionV3/notionRecordTypes';
import * as blockTypes from 'aNotion/types/notionV3/notionBlockTypes';
import { BlockTypeEnum, BlockProps } from '../types/notionV3/BlockTypes';
import {
   NotionBlockRecord,
   NotionBlockModel,
} from 'aNotion/models/NotionBlock';
import { ContentBlocks } from 'aNotion/components/contents/contentState';
import * as blockApi from 'aNotion/api/v3/blockApi';

export const getContent = (
   record: RecordMap,
   blockId: string
): [NotionBlockModel[], string[]] => {
   let node = record.block?.[blockId];
   let content: NotionBlockModel[] = [];
   let contentIds: string[] = [];

   if (node != null && node.value?.content != null) {
      let c = getNotionBlocksFromContent(node.value.content, record);
      contentIds.push(...node.value.content);
      content.push(...c);
   }

   if (node != null && node.value?.type === BlockTypeEnum.CollectionViewPage) {
      let colId = (node.value as blockTypes.CollectionViewPage).collection_id;
      if (record.collection != null) {
         //get parent block of collection
         let parentId = record.collection[colId].value?.parent_id;
         if (
            parentId != null &&
            record?.block?.[parentId]?.value?.content != null
         ) {
            let c = getNotionBlocksFromContent(
               record.block[parentId].value?.content!,
               record
            );
            contentIds.push(
               ...(record?.block?.[parentId]?.value?.content ?? [])
            );
            content.push(...c);
         }
      }
   }

   return [content, contentIds];
};

const getNotionBlocksFromContent = (
   contentIds: string[],
   record: RecordMap
) => {
   let content: NotionBlockModel[] = [];
   for (let childId of contentIds) {
      if (childId != null) {
         let cBlock = new NotionBlockRecord(record, childId);
         if (cBlock.type !== BlockTypeEnum.Unknown) {
            content.push(cBlock.toSerializable());
         }
      }
   }
   return content;
};

export const fetchContentForBlock = async (
   blockId: string,
   signal: AbortSignal,
   chunk?: PageChunk
): Promise<ContentBlocks[]> => {
   const resultContentBlocks: ContentBlocks[] = [];
   const missingBlocks: ContentBlocks[] = [];

   if (chunk == null) {
      chunk = await blockApi.loadPageChunk(blockId, 100, signal);
   }

   if (chunk != null && !signal.aborted) {
      extractContentFromChunk(
         chunk,
         blockId,
         resultContentBlocks,
         missingBlocks,
         signal
      );

      await extractContentFromSync(missingBlocks, signal, resultContentBlocks);
   }

   return resultContentBlocks;
};

const extractContentFromChunk = (
   chunk: PageChunk,
   blockId: string,
   resultContentBlocks: ContentBlocks[],
   missingBlocks: ContentBlocks[],
   signal: AbortSignal
) => {
   const [content, contentIds] = getContent(chunk?.recordMap, blockId);

   if (content.length === contentIds.length) {
      resultContentBlocks.push({
         blockId,
         content,
      });

      //recursion
      if (!signal.aborted) {
         contentIds.forEach((id) =>
            extractContentFromChunk(
               chunk,
               id,
               resultContentBlocks,
               missingBlocks,
               signal
            )
         );
      }
   } else if (contentIds.length > 0) {
      missingBlocks.push({
         blockId: blockId,
         content: [],
         contentIds: contentIds,
      });
   }
};

const extractContentFromSync = async (
   blocks: ContentBlocks[],
   signal: AbortSignal,
   resultContentBlocks: ContentBlocks[]
) => {
   const missingBlocks: ContentBlocks[] = [];

   if (blocks.length > 0) {
      const missingIds = [
         ...new Set(blocks.flatMap((m) => m.contentIds ?? [])),
      ];

      let chunk = await blockApi.syncRecordValues(missingIds, signal);
      if (chunk != null && !signal.aborted) {
         blocks.forEach((m) =>
            extractContentFromChunk(
               chunk!,
               m.blockId,
               resultContentBlocks,
               missingBlocks,
               signal
            )
         );
      }
   }

   //recursion
   if (missingBlocks.length > 0 && !signal.aborted) {
      await extractContentFromSync(missingBlocks, signal, resultContentBlocks);
   }
};
