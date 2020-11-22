import {
   NotionBlockRecord,
   INotionBlockModel,
} from 'aNotion/models/NotionBlock';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { INotionPageMarks } from 'aNotion/models/INotionPage';
import {
   IBaseTextBlock,
   IPage,
} from 'aNotion/types/notionV3/definitions/basic_blocks';
import { isBackGroundColor } from './blockService';
import * as blockApi from 'aNotion/api/v3/blockApi';
import {
   IRecordMap,
   Record,
   BlockRecord,
} from 'aNotion/types/notionV3/notionRecordTypes';
import { Block } from 'aNotion/types/notionV3/notionBlockTypes';
import {
   SemanticFormatEnum,
   SemanticString,
   SemanticFormat,
   SemanticFormatValue,
} from 'aNotion/types/notionV3/semanticStringTypes';

export const processPageForMarks = async (
   pageId: string,
   record: NotionBlockRecord,
   signal: AbortSignal
): Promise<INotionPageMarks> => {
   let pageMarks: INotionPageMarks = {
      pageId: pageId,
      highlights: [],
      todos: [],
      quotes: [],
      events: [],
      userMentions: [],
      pageMentions: [],
      code: [],
      comments: [],
      links: [],
      headers: [],
   };

   let contentIds = record.recordMapData.block[pageId].value?.content ?? [];
   await buildPageRecords(record.recordMapData, pageId, contentIds, signal);
   traverseForMarks(
      record.recordMapData,
      pageId,
      contentIds,
      signal,
      pageMarks
   );

   return pageMarks;
};

const buildPageRecords = async (
   recordMapData: IRecordMap,
   pageId: string,
   contentIds: string[],
   signal: AbortSignal
) => {
   if (signal.aborted) return;

   let haveData = contentIds.every((c) =>
      Object.keys(recordMapData.block).includes(c)
   );

   let content: { [key: string]: BlockRecord } = {};
   if (!haveData) {
      content = (await blockApi.syncRecordValues(contentIds ?? [], signal))
         .recordMap.block;
      Object.assign(recordMapData.block, content);
   } else {
      Object.entries(recordMapData.block)
         .filter(([blockId, block]) => contentIds.includes(blockId))
         .map(([blockId, block]) => (content[blockId] = block));
   }

   let subContentIds: string[] = [];
   Object.entries(content).forEach(([blockId, block]) => {
      let checkSubContents =
         block.value?.type !== BlockTypeEnum.Page &&
         block.value?.type !== BlockTypeEnum.CollectionViewPage;

      if (checkSubContents) subContentIds.push(...(block.value?.content ?? []));
   });

   if (subContentIds.length > 0 && !signal.aborted) {
      await buildPageRecords(recordMapData, pageId, subContentIds, signal);
   }
};

const traverseForMarks = (
   recordMapData: IRecordMap,
   pageId: string,
   contentIds: string[],
   signal: AbortSignal,
   pageMarks: INotionPageMarks
) => {
   if (signal.aborted) return;

   contentIds.forEach((blockId) => {
      let block = recordMapData.block[blockId];
      let subContentIds = block.value?.content ?? [];
      let checkSubContents =
         block.value?.type !== BlockTypeEnum.Page &&
         block.value?.type !== BlockTypeEnum.CollectionViewPage;

      getMarksInBlock(block, recordMapData, pageId, pageMarks);
      if (subContentIds.length > 0 && checkSubContents) {
         traverseForMarks(
            recordMapData,
            pageId,
            subContentIds,
            signal,
            pageMarks
         );
      }
   });
};

const getMarksInBlock = (
   block: Record<Block>,
   recordMapData: IRecordMap,
   pageId: string,
   pageMarks: INotionPageMarks
) => {
   try {
      let b = block.value as IBaseTextBlock;
      let blockRecord = new NotionBlockRecord(recordMapData, b.id);
      let nb = blockRecord.toSerializable();

      if (
         isBackGroundColor(b.format?.block_color) ||
         blockRecord.hasBgColor()
      ) {
         pageMarks.highlights.push(nb);
      }

      if (blockRecord.hasCode()) {
         pageMarks.code.push(nb);
      }

      if (blockRecord.hasComments()) {
         pageMarks.comments.push(nb);
      }

      if (blockRecord.hasLinks()) {
         pageMarks.links.push(nb);
      }
      if (blockRecord.hasPageMentions()) {
         pageMarks.pageMentions.push(nb);
      }

      if (blockRecord.hasUserMentions()) {
         pageMarks.userMentions.push(nb);
      }

      if (b.type === BlockTypeEnum.ToDo) {
         pageMarks.todos.push(nb);
      }

      if (b.type === BlockTypeEnum.Quote) {
         pageMarks.quotes.push(nb);
      }

      switch (b.type) {
         case BlockTypeEnum.Header1:
         case BlockTypeEnum.Header2:
         case BlockTypeEnum.Header3:
            pageMarks.headers.push(nb);
      }
   } catch {
      //ignore cast errors, if its not a BaseTextBlock, such as collections
   }
};

export const getPropertiesWithSemanticFormat = (
   pageBlock: INotionBlockModel,
   propertyType: SemanticFormatEnum
) => {
   let properties: string[] = [];

   if (pageBlock.type === BlockTypeEnum.Page) {
      let page = pageBlock.block as IPage;

      Object.keys(page.properties)
         .filter((k) => k !== 'title')
         .forEach((k) =>
            page.properties[k].forEach((ps) => {
               if (ps[1] != null && ps[0] != null) {
                  ps[1]
                     .filter(
                        (sf) =>
                           sf[0] != null &&
                           sf[1] != null &&
                           sf[0] === propertyType
                     )
                     .forEach((sf) => {
                        if (sf[1] != null) {
                           properties.push(sf[1]);
                        }
                     });
               }
            })
         );
   }

   return [...new Set(properties)];
};

export const hasSemanticFormatType = (
   property: SemanticString[],
   formatType: SemanticFormatEnum
) => {
   return property.some((s) => {
      if (s[0] != null && s[1] != null) {
         let format: SemanticFormat[] = s[1];
         return format.some((f) => {
            if (f[0] === formatType) {
               return true;
            }
            return false;
         });
      }
      return false;
   });
};

export const hasBackgroundColorFormat = (property: SemanticString[]) => {
   return property.some((s) => {
      if (s[0] != null && s[1] != null) {
         let format: SemanticFormat[] = s[1];
         return format.some((f) => {
            if (f[0] === SemanticFormatEnum.Colored) {
               if (f[1]?.includes('background')) {
                  return true;
               }
            }
            return false;
         });
      }
      return false;
   });
};

export const getSemanticStringForType = (
   property: SemanticString[],
   formatType: SemanticFormatEnum
): SemanticString[] => {
   return property.filter((s) => {
      if (s[0] != null && s[1] != null) {
         let format: SemanticFormat[] = s[1];
         return format.some((f) => {
            if (f[0] === formatType) {
               return true;
            }
            return false;
         });
      }
      return false;
   });
};

export const getValuesForSemanticType = (
   property: SemanticString[],
   formatType: SemanticFormatEnum
): string[] => {
   const filtered = getSemanticStringForType(property, formatType);
   return getValuesOfSemanticStringArray(property);
};

export const getValuesOfSemanticString = (
   property: SemanticString
): SemanticFormatValue | undefined => {
   if (property[1]?.[0]?.[1] != null) {
      return property[1][0][1];
   } else {
      return undefined;
   }
};

export const getValuesOfSemanticStringArray = (
   property: SemanticString[]
): string[] => {
   return property
      .flatMap((m) => getValuesOfSemanticString(m))
      .filter((m) => m != null)
      .map((m) => m as string);
};
