import { SemanticString } from '../../notionModels';
import { EmptyBlock } from './empty_block';
import * as base from '../../notionBaseTypes';
import { BlockNames } from '../../BlockEnums';

/**
 * Image block.
 */
export interface Image extends EmptyBlock {
   type: BlockNames.Image;
   properties?: {
      /**
       * Normally, the same as `display_source` in {@link BlockFormat}.
       * When they are different, use `display_source`.
       */
      source?: [[base.NotionSecureUrl | base.PublicUrl]];
      caption?: SemanticString[];
   };
   /**  Defined if the user uploaded an image. */
   file_ids?: base.UUID[];
}

/**
 * Video block.
 */
export interface Video extends EmptyBlock {
   type: BlockNames.Video;
   properties?: {
      /**
       * Normally, the same as `display_source` in {@link BlockFormat}.
       * When they are different, use `display_source`.
       */
      source?: [[base.NotionSecureUrl | base.PublicUrl]];
      caption?: SemanticString[];
   };
   /**  Defined if the user uploaded a video. */
   file_ids?: base.UUID[];
}

/**
 * Audio block.
 */
export interface Audio extends EmptyBlock {
   type: BlockNames.Audio;
   properties?: {
      source: [[base.NotionSecureUrl | base.PublicUrl]];
   };
   /**  Defined if the user uploaded an audio file. */
   file_ids?: base.UUID[];
}

/**
 * Web Bookmark block.
 */
export interface Bookmark extends EmptyBlock {
   type: BlockNames.Bookmark;
   properties?: {
      /** Link of the bookmarked web page. */
      link: [[string]];
      /** Title of the bookmarked web page, auto detected. */
      title?: [[string]];
      /** Description of the bookmarked web page, auto detected. */
      description?: [[string]];
   };
}

/**
 * Code block.
 */
export interface Code extends EmptyBlock {
   type: BlockNames.Code;
   properties?: {
      /** Code content. */
      title?: [[string]];
      language?: [[string]];
   };
}

/**
 * File block.
 */
export interface File extends EmptyBlock {
   type: BlockNames.File;
   properties?: {
      /** Filename. */
      title: [[string]];
      /** URL of the file. */
      source: [[base.NotionSecureUrl | base.PublicUrl]];
      /** File size, defined if the user uploaded a file. */
      size?: [[string]];
   };
   /**  Defined if the user uploaded a file. */
   file_ids?: base.UUID[];
}

export type MediaBlockUnion = Image | Video | Audio | Bookmark | Code | File;
