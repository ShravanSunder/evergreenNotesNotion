import { Segment } from 'aNotion/types/notionV3/semanticStringTypes';
import * as base from 'aNotion/types/notionV3/notionBaseTypes';
import { BlockTypeEnum } from '../BlockTypes';
import { IEmptyBlock } from './basic_blocks';

/**
 * General purpose embed block.
 */
export interface Embed extends IEmptyBlock {
   type:
      | BlockTypeEnum.Embed
      | BlockTypeEnum.EmbedCodePen
      | BlockTypeEnum.EmbedInvision;
   properties?: {
      /**
       * This is a normal link.
       *
       * Use `display_source` in {@link BlockFormat} for an iframe.
       */
      source?: [[base.PublicUrl]];
      caption?: Segment[];
   };
}

// /**
//  * Codepen embed block.
//  */
// export interface Codepen extends Embed {
//    type: BlockNames.CodePen;
//    properties?: {
//       /**
//        * This is a normal link.
//        *
//        * Use `display_source` in {@link BlockFormat} for an iframe.
//        */
//       source?: [[base.PublicUrl]];
//       caption?: SemanticString[];
//    };
// }

// /**
//  * Invision embed block.
//  */
// export interface Invision extends EmptyBlock {
//    type: 'invision';
//    properties?: {
//       source?: [[base.PublicUrl]];
//    };
// }

/**
 * PDF embed block.
 */
export interface PDF extends IEmptyBlock {
   type: BlockTypeEnum.PDF;
   properties?: {
      source?: [[base.NotionSecureUrl | base.PublicUrl]];
   };
   /** Defined if the user uploaded a pdf. */
   file_ids?: base.UUID[];
}

export type EmbedBlockUnion = Embed | PDF; //|// Codepen | Invision | PDF;
