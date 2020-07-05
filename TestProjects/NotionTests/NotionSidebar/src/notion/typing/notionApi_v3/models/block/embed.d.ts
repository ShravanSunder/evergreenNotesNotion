import { SemanticString } from '../notionModels';
import { EmptyBlock } from './empty_block';
import * as base from '../../baseTypes';

/**
 * General purpose embed block.
 */
export interface Embed extends EmptyBlock {
   type: 'embed';
   properties?: {
      /**
       * This is a normal link.
       *
       * Use `display_source` in {@link BlockFormat} for an iframe.
       */
      source?: [[base.PublicUrl]];
      caption?: SemanticString[];
   };
}

/**
 * Codepen embed block.
 */
export interface Codepen extends EmptyBlock {
   type: 'codepen';
   properties?: {
      /**
       * This is a normal link.
       *
       * Use `display_source` in {@link BlockFormat} for an iframe.
       */
      source?: [[base.PublicUrl]];
      caption?: SemanticString[];
   };
}

/**
 * Invision embed block.
 */
export interface Invision extends EmptyBlock {
   type: 'invision';
   properties?: {
      source?: [[base.PublicUrl]];
   };
}

/**
 * PDF embed block.
 */
export interface PDF extends EmptyBlock {
   type: 'pdf';
   properties?: {
      source?: [[base.NotionSecureUrl | base.PublicUrl]];
   };
   /** Defined if the user uploaded a pdf. */
   file_ids?: base.UUID[];
}

export type EmbedBlockUnion = Embed | Codepen | Invision | PDF;
