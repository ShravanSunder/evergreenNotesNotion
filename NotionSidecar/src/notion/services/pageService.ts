import { NotionBlockRecord } from 'aNotion/models/NotionBlock';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import { NotionPageMarks } from 'aNotion/models/NotionPage';
import { BaseTextBlock } from 'aNotion/types/notionV3/typings/basic_blocks';
import { isChild, isBackGroundColor } from './blockService';

export const processPageForMarks = (
   pageId: string,
   record: NotionBlockRecord
): NotionPageMarks => {
   let notionPage: NotionPageMarks = {
      pageId: pageId,
      highlights: [],
      todos: [],
      quotes: [],
      events: [],
      mentions: [],
   };

   Object.entries(record.recordMapData.block).forEach(([blockId, block]) => {
      try {
         let b = block.value as BaseTextBlock;
         let nb = new NotionBlockRecord(record.recordMapData, b.id);
         if (isChild(nb, pageId)) {
            if (isBackGroundColor(b.format?.block_color)) {
               notionPage.highlights.push(nb.toSerializable());
            }

            if (b.type === BlockTypes.ToDo) {
               let nb = new NotionBlockRecord(record.recordMapData, b.id);
               notionPage.todos.push(nb.toSerializable());
            }

            if (b.type === BlockTypes.Quote) {
               let nb = new NotionBlockRecord(record.recordMapData, b.id);
               notionPage.quotes.push(nb.toSerializable());
            }
         }
      } catch {
         //ignore cast errors, if its not a BaseTextBlock, such as collections
      }
   });

   return notionPage;
};
