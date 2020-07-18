import { SemanticString } from './semantic_string';
import { Permission } from './permission';
import * as base from '../notionBaseTypes';
import { Collection } from './collection';
import { BlockTypes } from '../BlockTypes';

/**
 * An abstract block, used to hold common properties of all blocks.
 *
 * Doesn't actually exist in Notion.
 */
export interface EmptyBlock {
   id: base.UUID;
   version: number;
   type: BlockTypes;
   format?: BlockFormat;
   /** Ids of children blocks */
   content?: base.UUID[];
   created_by: base.UUID;
   /** Appear in recently created blocks. */
   created_by_id?: base.UUID;
   /** Appear in recently created blocks. */
   created_by_table?: base.Table;
   created_time: base.TimestampNumber;
   last_edited_by: base.UUID;
   /** Appear in recently created blocks. */
   last_edited_by_id?: base.UUID;
   /** Appear in recently created blocks. */
   last_edited_by_table?: base.Table;
   last_edited_time: base.TimestampNumber;
   parent_id: base.UUID;
   parent_table: base.Table;
   alive: boolean;
   /** Copied from another block. */
   copied_from?: base.UUID;
}

/**
 * Everything about how to layout a block.
 */
export interface BlockFormat {
   block_locked?: boolean;
   /** User ID. */
   block_locked_by?: base.UUID;
   block_color?: base.NotionColor;
   block_width?: number;
   block_height?: number;
   /** Full viewport width. */
   block_full_width?: boolean;
   /** The same width as the parent page. */
   block_page_width?: boolean;
   /** Height divided by width. */
   block_aspect_ratio?: number;
   /** Whether to force isotropic [scaling](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale). */
   block_preserve_scale?: boolean;
   /** Icon URL of the bookmarked web page. */
   bookmark_icon?: base.PublicUrl;
   /** Cover URL of the bookmarked web page. */
   bookmark_cover?: base.PublicUrl;
   column_ratio?: base.Proportion;
   code_wrap?: boolean;
   display_source?: base.NotionSecureUrl | base.PublicUrl;
   page_icon?: base.Emoji | base.NotionSecureUrl | base.PublicUrl;
   page_cover?: base.NotionRelativePath | base.NotionSecureUrl | base.PublicUrl;
   page_full_width?: boolean;
   page_cover_position?: base.Proportion;
}

/**
 * Embedded Sub-Page block or Link To Page block.
 */
export interface Page extends EmptyBlock {
   type: BlockTypes.Page;
   /**
    * In a database, every record is a page. Properties set in a database
    * are stored here.
    * Content of all types of property can be expressed as
    * a {@link SemanticString} array. Some interesting types are listed below:
    *
    * Relation — They use {@link InlineMentionPage} to represent related
    * pages, so for example, if a page is related to another 3 pages,
    * it looks like
    *
    * ```
    * [InlineMentionPage, [","], InlineMentionPage, [","], InlineMentionPage]
    * ```
    */
   properties: {
      [key in Collection.ColumnID]: SemanticString[];
   };
   permissions?: Permission[];
   /**
    * Defined if the user upload images for page icon and page cover.
    */
   file_ids?: base.UUID[];
}

/**
 * Text block. Editable, can have children.
 */
export interface Text extends EmptyBlock {
   type: BlockTypes.Text;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Bulleted List block. Editable, can have children.
 */
export interface BulletedList extends EmptyBlock {
   type: BlockTypes.ButtetedList;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Numbered List block. Editable, can have children.
 */
export interface NumberedList extends EmptyBlock {
   type: BlockTypes.NumberedList;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * To Do block. Editable, can have children.
 */
export interface ToDo extends EmptyBlock {
   type: BlockTypes.ToDo;
   properties?: {
      title?: SemanticString[];
      checked?: [['Yes' | 'No']];
   };
}

/**
 * Toggle block. Editable, can have children.
 */
export interface Toggle extends EmptyBlock {
   type: BlockTypes.Toggle;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Heading1 block. Editable, can't have children.
 */
export interface Header1 extends EmptyBlock {
   type: BlockTypes.Header1;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Heading2 block. Editable, can't have children.
 */
export interface Header2 extends EmptyBlock {
   type: BlockTypes.Header2;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Heading3 block. Editable, can't have children.
 */
export interface Header3 extends EmptyBlock {
   type: BlockTypes.Header3;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Quote block. Editable, can't have children.
 */
export interface Quote extends EmptyBlock {
   type: BlockTypes.Quote;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Callout block. Editable, can't have children.
 */
export interface Callout extends EmptyBlock {
   type: BlockTypes.Callout;
   properties?: {
      title?: SemanticString[];
   };
   /** Defined if the user uploaded an image for icon. */
   file_ids?: base.UUID[];
}

/**
 * Column List block. Not editable, can have children.
 *
 * This is used to wrap blocks that should be displayed in the same row.
 *
 * Children of this block must be {@link Column}.
 */
export interface ColumnList extends EmptyBlock {
   type: BlockTypes.ColumnList;
}

/**
 * Column block. Not editable, can have children.
 *
 * Parent of this block must be {@link ColumnList}.
 */
export interface Column extends EmptyBlock {
   type: BlockTypes.Column;
}

/**
 * Divider block. Not editable, can't have children.
 */
export interface Divider extends EmptyBlock {
   type: BlockTypes.Divider;
}

export interface TableOfContents extends EmptyBlock {
   type: BlockTypes.TableOfContents;
}

/**
 * Math Equation block.
 */
export interface Equation extends EmptyBlock {
   type: BlockTypes.Equation;
   properties?: {
      /** LaTeX. */
      title?: [[string]];
   };
}

/**
 * Template button block.
 */
export interface TemplateButton extends EmptyBlock {
   type: BlockTypes.TemplateButton;
   properties?: {
      /** Button name. */
      title?: [[string]];
   };
}

export interface Breadcrumb extends EmptyBlock {
   type: BlockTypes.BreadCrumb;
}

export type BasicBlockUnion =
   | Page
   | Text
   | BulletedList
   | NumberedList
   | ToDo
   | Toggle
   | Header1
   | Header2
   | Header3
   | Quote
   | Callout
   | ColumnList
   | Column
   | Divider
   | TableOfContents
   | Equation
   | TemplateButton
   | Breadcrumb
   | Image
   | Video
   | Audio
   | Bookmark
   | Code
   | File;

/**
 * Image block.
 */
export interface Image extends EmptyBlock {
   type: BlockTypes.Image;
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
   type: BlockTypes.Video;
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
   type: BlockTypes.Audio;
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
   type: BlockTypes.Bookmark;
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
   type: BlockTypes.Code;
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
   type: BlockTypes.File;
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
