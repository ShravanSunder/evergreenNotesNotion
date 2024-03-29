import {
   IRecordMap,
   Record,
   IPageChunk,
   NotionUserRecord,
} from 'aNotion/types/notionV3/notionRecordTypes';
import * as blockTypes from 'aNotion/types/notionV3/notionBlockTypes';
import { BlockTypeEnum, BlockProps } from 'aNotion/types/notionV3/BlockTypes';
import {
   NotionBlockRecord,
   INotionBlockModel,
} from 'aNotion/models/NotionBlock';
import { ContentBlocks } from 'aNotion/components/contents/contentState';
import * as blockApi from 'aNotion/api/v3/blockApi';

export const getContent = (
   record: IRecordMap,
   blockId: string
): [INotionBlockModel[], string[], string[]] => {
   let node = record.block?.[blockId];
   let content: INotionBlockModel[] = [];
   let contentIds: string[] = [];
   let idsOfMissingContent: string[] = [];

   if (
      node != null &&
      node.value?.content != null &&
      node.value?.type !== BlockTypeEnum.CollectionViewPage &&
      node.value?.type !== BlockTypeEnum.CollectionViewInline
   ) {
      let [tempContent, tempIdsOfMissingContent] = getNotionBlocksFromContent(
         node.value.content,
         record
      );
      contentIds.push(...node.value.content);
      content.push(...tempContent);
      idsOfMissingContent.push(...tempIdsOfMissingContent);
   }

   if (
      node != null &&
      (node.value?.type === BlockTypeEnum.CollectionViewPage ||
         node.value?.type === BlockTypeEnum.CollectionViewInline)
   ) {
      let colId = (node.value as blockTypes.CollectionViewPage).collection_id;
      if (record.collection != null) {
         //get parent block of collection
         let parentId = record.collection[colId].value?.parent_id;
         if (
            parentId != null &&
            record?.block?.[parentId]?.value?.content != null
         ) {
            let [
               tempContent,
               tempIdsOfMissingContent,
            ] = getNotionBlocksFromContent(
               record.block[parentId].value?.content!,
               record
            );
            contentIds.push(
               ...(record?.block?.[parentId]?.value?.content ?? [])
            );
            content.push(...tempContent);
            idsOfMissingContent.push(...tempIdsOfMissingContent);
         }
      }
   }

   return [content, contentIds, idsOfMissingContent];
};

const getNotionBlocksFromContent = (
   contentIds: string[],
   record: IRecordMap
): [INotionBlockModel[], string[]] => {
   let content: INotionBlockModel[] = [];
   let idsOfMissingContent: string[] = [];
   for (let childId of contentIds) {
      if (childId != null) {
         let cBlock = new NotionBlockRecord(record, childId);
         if (cBlock.type !== BlockTypeEnum.Unknown) {
            content.push(cBlock.toSerializable());
         } else {
            idsOfMissingContent.push(childId);
         }
      }
   }
   return [content, idsOfMissingContent];
};

export const fetchContentForBlock = async (
   blockId: string,
   signal: AbortSignal,
   chunk?: IPageChunk
): Promise<{
   contentBlocks: ContentBlocks[];
   userMap: { [key: string]: NotionUserRecord } | undefined;
}> => {
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

      await fetchContentFromSync(missingBlocks, signal, resultContentBlocks);
   }

   let userMap = chunk?.recordMap.notion_user;

   return { contentBlocks: resultContentBlocks, userMap };
};

const extractContentFromChunk = (
   chunk: IPageChunk,
   blockId: string,
   resultContentBlocks: ContentBlocks[],
   missingBlocksList: ContentBlocks[],
   signal: AbortSignal
) => {
   const [content, contentIds, idsOfMissingContent] = getContent(
      chunk?.recordMap,
      blockId
   );

   if (idsOfMissingContent.length === 0) {
      //if no content is missing, save it, recurse into the children
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
               missingBlocksList,
               signal
            )
         );
      }
   } else if (contentIds.length > 0) {
      // if any content is missing, record missing blocks
      missingBlocksList.push({
         blockId: blockId,
         content: [],
         contentIds: contentIds,
      });
   }
};

const fetchContentFromSync = async (
   blocks: ContentBlocks[],
   signal: AbortSignal,
   resultContentBlocks: ContentBlocks[]
) => {
   const newMissingBlocks: ContentBlocks[] = [];

   if (blocks.length > 0) {
      const missingIds = [
         ...new Set(blocks.flatMap((m) => m.contentIds ?? [])),
         ...blocks.map((c) => c.blockId),
      ];

      let chunk = await blockApi.syncRecordValues(missingIds, signal);
      if (chunk != null && !signal.aborted) {
         blocks.forEach((m) =>
            extractContentFromChunk(
               chunk!,
               m.blockId,
               resultContentBlocks,
               newMissingBlocks,
               signal
            )
         );
      }
   }

   // if there are any missing blocks, do this again for all of them
   if (newMissingBlocks.length > 0 && !signal.aborted) {
      await fetchContentFromSync(newMissingBlocks, signal, resultContentBlocks);
   }
};
