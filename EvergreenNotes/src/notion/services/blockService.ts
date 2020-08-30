//make a way to get the page title and data
// doesn't matter if its a page or collection or whatever
// get title, properties etc.  using blocks as reference

import { PageChunk } from 'aNotion/types/notionV3/notionRecordTypes';
import {
   NotionBlockRecord,
   NotionBlockModel,
} from 'aNotion/models/NotionBlock';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import { SemanticString } from 'aNotion/types/notionV3/semanticStringTypes';
import * as blockApi from 'aNotion/api/v3/blockApi';
import * as LoadPageChunk from 'aNotion/types/notionv3/notionRecordTypes';
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
} from '@material-ui/core/colors';
import { NotionColor } from 'aNotion/types/notionV3/notionBaseTypes';

export const fetchPageRecord = async (
   pageId: string,
   signal: AbortSignal,
   liteApi: boolean = false
): Promise<NotionBlockRecord> => {
   let chunk: LoadPageChunk.PageChunk;
   let block: NotionBlockRecord | undefined = undefined;

   let sycRecordPromise = blockApi.syncRecordValues([pageId], signal);
   let loadChunkPromise = blockApi.loadPageChunk(pageId, 1, signal);

   if (liteApi) {
      try {
         // this method is much faster, but doesn't work for collection pages
         chunk = (await sycRecordPromise) as LoadPageChunk.PageChunk;

         if (chunk != null && !signal.aborted) {
            block = getBlockFromPageChunk(chunk, pageId);
            if (block.type === BlockTypes.CollectionViewPage) {
               block = undefined;
            }
         }
      } catch {
         // try again with full page data, when required
      }
   }

   if (block == null && !signal.aborted) {
      chunk = (await loadChunkPromise) as LoadPageChunk.PageChunk;

      if (chunk != null && !signal.aborted) {
         block = getBlockFromPageChunk(chunk, pageId);
      }
   }

   return block!;
};

export const getBlockFromPageChunk = (
   page: PageChunk,
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

export const isNavigable = (block: NotionBlockModel): boolean => {
   return (
      block.type === BlockTypes.Page ||
      block.type === BlockTypes.CollectionViewPage
   );
};

export const reduceTitle = (title?: SemanticString[]) => {
   if (title != null) {
      return title
         .map((segment) => {
            return segment[0];
         })
         .reduce((acuumulator, value) => {
            return acuumulator + ' ' + value;
         });
   }
   return '';
};

export const getColor = (color: NotionColor | string): string | undefined => {
   if (color != null) {
      switch (color) {
         case NotionColor.Grey:
            return grey[600];
         case NotionColor.Brown:
            return brown[400];
         case NotionColor.Orange:
            return deepOrange[400];
         case NotionColor.Yellow:
            return yellow[400];
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
            return grey[200];
         case NotionColor.BrownBg:
            return brown[100];
         case NotionColor.OrangeBg:
            return deepOrange[50];
         case NotionColor.YellowBg:
            return yellow[50];
         case NotionColor.TealBg:
            return teal[50];
         case NotionColor.BlueBg:
            return blue[50];
         case NotionColor.PurpleBg:
            return purple[50];
         case NotionColor.PinkBg:
            return pink[50];
         case NotionColor.RedBg:
            return red[50];
      }
   }

   //transparent
   return undefined;
};

export const getBackgroundColor = (block: NotionBlockModel) => {
   let bgColor = block.block?.format?.block_color;
   if (block.type === BlockTypes.Code) {
      bgColor = NotionColor.GreyBg;
   }

   let color: string | undefined = undefined;
   if (bgColor) {
      color = getColor(bgColor);
   }

   //transparent
   return color ?? '#FFFFFF';
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