//make a way to get the page title and data
// doesn't matter if its a page or collection or whatever
// get title, properties etc.  using blocks as reference

import { IPageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import {
   NotionBlockRecord,
   INotionBlockModel,
} from 'aNotion/models/NotionBlock';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import {
   AbsoluteDateTime,
   RelativeDateTime,
   SemanticFormatEnum,
   Segment,
} from 'aNotion/types/notionV3/semanticStringTypes';
import * as blockApi from 'aNotion/api/v3/blockApi';
import * as LoadPageChunk from 'aNotion/types/notionV3/notionRecordTypes';
import {
   grey,
   brown,
   purple,
   deepOrange,
   yellow,
   teal,
   blue,
   pink,
   red,
   deepPurple,
   indigo,
   amber,
} from '@material-ui/core/colors';
import { NotionColor } from 'aNotion/types/notionV3/notionBaseTypes';
import { DateTime } from 'luxon';

export const fetchPageRecord = async (
   pageId: string,
   signal: AbortSignal,
   limit: number = 30,
   liteApi: boolean = false
): Promise<[NotionBlockRecord, LoadPageChunk.IPageChunk]> => {
   let chunk: LoadPageChunk.IPageChunk | undefined = undefined;
   let block: NotionBlockRecord | undefined = undefined;

   if (liteApi) {
      try {
         let sycRecordPromise = blockApi.syncRecordValues([pageId], signal);
         // this method is much faster, but doesn't work for collection pages
         chunk = (await sycRecordPromise) as LoadPageChunk.IPageChunk;

         if (chunk != null && !signal.aborted) {
            block = getBlockFromPageChunk(chunk, pageId);
            if (block.type === BlockTypeEnum.CollectionViewPage) {
               block = undefined;
            }
         }
      } catch {
         // try again with full page data, when required
      }
   }

   let loadChunkPromise = blockApi.loadPageChunk(pageId, limit, signal);
   if (block == null && !signal.aborted) {
      chunk = (await loadChunkPromise) as LoadPageChunk.IPageChunk;

      if (chunk != null && !signal.aborted) {
         block = getBlockFromPageChunk(chunk, pageId);
      }
   }

   return [block!, chunk!];
};

export const syncBlockRecords = async (
   blockIds: string[],
   signal: AbortSignal
): Promise<[NotionBlockRecord[], LoadPageChunk.IPageChunk]> => {
   let chunk: LoadPageChunk.IPageChunk | undefined = undefined;
   let blocks: NotionBlockRecord[] = [];

   let sycRecordPromise = blockApi.syncRecordValues(blockIds, signal);

   // this method is much faster, but doesn't work for collection pages
   chunk = (await sycRecordPromise) as LoadPageChunk.IPageChunk;

   if (chunk != null && !signal.aborted) {
      blockIds.forEach((id) => {
         let block = getBlockFromPageChunk(chunk!, id);
         if (block.block != null) {
            blocks.push(block);
         }
      });
   }

   return [blocks, chunk!];
};

export const getBlockFromPageChunk = (
   page: IPageChunk,
   pageId: string
): NotionBlockRecord => {
   try {
      let m = new NotionBlockRecord(page.recordMap, pageId);
      return m;
   } catch (err) {
      console.log(err);
      throw err;
   }
};

export const isNavigable = (block: INotionBlockModel): boolean => {
   return (
      block.type === BlockTypeEnum.Page ||
      block.type === BlockTypeEnum.CollectionViewPage
   );
};

export const parseDate = (dateData: any) => {
   let segmentDetails: string = '';
   try {
      if (dateData.date_format === 'relative') {
         let date = dateData as RelativeDateTime;
         segmentDetails =
            '@' +
            DateTime.fromFormat(date.start_date, 'yyyy-MM-dd').toRelative();
         if (date.end_date)
            segmentDetails =
               ' ⟶ ' +
               DateTime.fromFormat(date.end_date, 'yyyy-MM-dd').toRelative();
      } else {
         let date = dateData as AbsoluteDateTime;
         segmentDetails =
            '@' +
            DateTime.fromFormat(date.start_date, 'yyyy-MM-dd').toFormat(
               date.date_format
            );
         if (date.end_date)
            segmentDetails =
               ' ⟶ ' +
               DateTime.fromFormat(date.end_date, 'yyyy-MM-dd').toFormat(
                  date.date_format
               );
      }
   } catch {}
   return segmentDetails;
};

export const reduceTitle = (title?: Segment[]) => {
   if (title != null) {
      return title
         .map((segment) => {
            if (segment[1] != null) {
               //handle dates
               let dateData = segment[1] as any;
               return parseDate(dateData);
            }
            return segment[0];
         })
         .reduce((acuumulator, value) => {
            return acuumulator + ' ' + value;
         });
   }
   return '';
};

export const getColor = (
   color: NotionColor | string,
   isDark: boolean
): string | undefined => {
   if (color != null) {
      switch (color) {
         case NotionColor.Grey:
            return isDark ? grey[900] : grey[600];
         case NotionColor.Brown:
            return brown[400];
         case NotionColor.Orange:
            return deepOrange[400];
         case NotionColor.Yellow:
            return yellow[600];
         case NotionColor.Teal:
            return teal[400];
         case NotionColor.Blue:
            return blue[400];
         case NotionColor.Purple:
            return purple[400];
         case NotionColor.Pink:
            return pink[400];
         case NotionColor.Red:
            return red[400];
         case NotionColor.GreyBg:
            return isDark ? '#454b4e' : '#ebeed';
         case NotionColor.BrownBg:
            return isDark ? '#434040' : '#e9e5e3';
         case NotionColor.OrangeBg:
            return isDark ? '#594a3a' : '#faebdd';
         case NotionColor.YellowBg:
            return isDark ? '#3f4138' : '#fbf3db';
         case NotionColor.TealBg:
            return isDark ? '#354c4b' : '#ddedea';
         case NotionColor.BlueBg:
            return isDark ? '#364954' : '#ddebf1';
         case NotionColor.PurpleBg:
            return isDark ? '#443f57' : '#eae4f2';
         case NotionColor.PinkBg:
            return isDark ? '#533b4c' : '#f4dfeb';
         case NotionColor.RedBg:
            return isDark ? '#594141' : '#fbe4e4';
      }
   }

   //transparent
   return undefined;
};

export const getBackgroundColor = (
   block: INotionBlockModel,
   isDark: boolean
) => {
   let bgColor = block.block?.format?.block_color;
   if (block.type === BlockTypeEnum.Code) {
      bgColor = NotionColor.GreyBg;
   }

   let color: string | undefined = undefined;
   if (bgColor && isBackGroundColor(bgColor)) {
      color = getColor(bgColor, isDark);
   }

   //transparent
   return color ?? '#FFFFFF';
};

export const getForegroundColor = (
   block: INotionBlockModel,
   isDark: boolean
) => {
   let bgColor = block.block?.format?.block_color;

   let color: string | undefined = undefined;
   if (bgColor && !isBackGroundColor(bgColor)) {
      color = getColor(bgColor, isDark);
   }

   //transparent
   return color;
};

export const isBackGroundColor = (color: NotionColor | undefined) => {
   switch (color) {
      case NotionColor.BlueBg:
      case NotionColor.BrownBg:
      case NotionColor.GreyBg:
      case NotionColor.OrangeBg:
      case NotionColor.PinkBg:
      case NotionColor.PurpleBg:
      case NotionColor.RedBg:
      case NotionColor.TealBg:
      case NotionColor.YellowBg:
         return true;
   }

   return false;
};
export const isChild = (nb: NotionBlockRecord, pageId: string): boolean => {
   if (nb.getParentsNodes().find((f) => f.blockId === pageId)) return true;
   return false;
};

export const aggregateParentSemanticFilter = (
   style: React.CSSProperties | undefined,
   semanticFilter: SemanticFormatEnum[] | undefined
) => {
   let filteredSemanticFilter: SemanticFormatEnum[] = [];
   if (style?.backgroundColor !== '#ffffff' && style?.backgroundColor != null) {
      filteredSemanticFilter =
         semanticFilter?.filter((f) => f !== SemanticFormatEnum.Colored) ?? [];
   } else if (semanticFilter != null) {
      filteredSemanticFilter = [...semanticFilter];
   }
   return filteredSemanticFilter;
};

export const inheritAndCombineStyles = (
   style: React.CSSProperties | undefined,
   backgroundColor: string,
   color: string | undefined
) => {
   let blockStyle: React.CSSProperties = {
      ...style,
   };

   if (backgroundColor !== '#FFFFFF' && backgroundColor != null) {
      blockStyle.backgroundColor = backgroundColor;
   }

   if (color != null) {
      blockStyle.color = color;
   }
   return blockStyle;
};
