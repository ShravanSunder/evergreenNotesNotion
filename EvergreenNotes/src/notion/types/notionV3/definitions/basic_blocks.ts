import { Segment } from 'aNotion/types/notionV3/semanticStringTypes';
import { t_Permission as Permission } from './permission';
import * as base from 'aNotion/types/notionV3/notionBaseTypes';
import { BlockTypeEnum } from '../BlockTypes';

/**
 * Everything about how to layout a block.
 */
export interface IBlockFormat {
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
 * An abstract block, used to hold common properties of all blocks.
 *
 * Doesn't actually exist in Notion.
 */
export interface IEmptyBlock {
   id: base.UUID;
   version: number;
   type: BlockTypeEnum;
   format?: IBlockFormat;
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

export interface IBaseTextBlock extends IEmptyBlock {
   properties?: {
      title?: Segment[];
   };
}

/**
 * Embedded Sub-Page block or Link To Page block.
 */
export interface IPage extends IBaseTextBlock {
   type: BlockTypeEnum.Page;
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
      title: Segment[];
      [key: string]: Segment[];
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
export interface IText extends IBaseTextBlock {
   type: BlockTypeEnum.Text;
   properties?: {
      title: Segment[];
   };
}

/**
 * Bulleted List block. Editable, can have children.
 */
export interface IBulletedList extends IBaseTextBlock {
   type: BlockTypeEnum.ButtetedList;
   properties?: {
      title: Segment[];
   };
}

/**
 * Numbered List block. Editable, can have children.
 */
export interface INumberedList extends IBaseTextBlock {
   type: BlockTypeEnum.NumberedList;
   properties?: {
      title: Segment[];
   };
}

/**
 * To Do block. Editable, can have children.
 */
export interface IToDo extends IBaseTextBlock {
   type: BlockTypeEnum.ToDo;
   properties?: {
      title: Segment[];
      checked?: [['Yes' | 'No']];
   };
}

/**
 * Toggle block. Editable, can have children.
 */
export interface IToggle extends IBaseTextBlock {
   type: BlockTypeEnum.Toggle;
   properties?: {
      title: Segment[];
   };
}

/**
 * Heading1 block. Editable, can't have children.
 */
export interface IHeader1 extends IBaseTextBlock {
   type: BlockTypeEnum.Header1;
   properties?: {
      title: Segment[];
   };
}

/**
 * Heading2 block. Editable, can't have children.
 */
export interface IHeader2 extends IBaseTextBlock {
   type: BlockTypeEnum.Header2;
   properties?: {
      title: Segment[];
   };
}

/**
 * Heading3 block. Editable, can't have children.
 */
export interface IHeader3 extends IBaseTextBlock {
   type: BlockTypeEnum.Header3;
   properties?: {
      title: Segment[];
   };
}

/**
 * Quote block. Editable, can't have children.
 */
export interface IQuote extends IBaseTextBlock {
   type: BlockTypeEnum.Quote;
   properties?: {
      title: Segment[];
   };
}

/**
 * Callout block. Editable, can't have children.
 */
export interface ICallout extends IBaseTextBlock {
   type: BlockTypeEnum.Callout;
   properties?: {
      title: Segment[];
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
export interface IColumnList extends IEmptyBlock {
   type: BlockTypeEnum.ColumnList;
}

/**
 * Column block. Not editable, can have children.
 *
 * Parent of this block must be {@link ColumnList}.
 */
export interface IColumn extends IEmptyBlock {
   type: BlockTypeEnum.Column;
}

/**
 * Divider block. Not editable, can't have children.
 */
export interface IDivider extends IEmptyBlock {
   type: BlockTypeEnum.Divider;
}

export interface ITableOfContents extends IEmptyBlock {
   type: BlockTypeEnum.TableOfContents;
}

/**
 * Math Equation block.
 */
export interface IEquation extends IBaseTextBlock {
   type: BlockTypeEnum.Equation;
   properties?: {
      /** LaTeX. */
      title?: Segment[];
   };
}

/**
 * Template button block.
 */
export interface ITemplateButton extends IBaseTextBlock {
   type: BlockTypeEnum.TemplateButton;
   properties?: {
      /** Button name. */
      title?: Segment[];
   };
}

export interface IBreadcrumb extends IEmptyBlock {
   type: BlockTypeEnum.BreadCrumb;
}

export type TBasicBlockUnion =
   | IText
   | IBulletedList
   | INumberedList
   | IToDo
   | IToggle
   | IHeader1
   | IHeader2
   | IHeader3
   | IQuote
   | ICallout
   | IColumnList
   | IColumn
   | IDivider
   | ITableOfContents
   | IEquation
   | ITemplateButton
   | IBreadcrumb
   | IImage
   | IVideo
   | IAudio
   | IBookmark
   | ICode
   | IFile;

/**
 * Image block.
 */
export interface IBaseSourceBlock extends IEmptyBlock {
   properties?: {
      /**
       * Normally, the same as `display_source` in {@link BlockFormat}.
       * When they are different, use `display_source`.
       */
      source?: [[base.NotionSecureUrl | base.PublicUrl]];
      title?: [[string]];
   };
}

/**
 * Image block.
 */
export interface IImage extends IBaseSourceBlock {
   type: BlockTypeEnum.Image;
   properties?: {
      /**
       * Normally, the same as `display_source` in {@link BlockFormat}.
       * When they are different, use `display_source`.
       */
      source?: [[base.NotionSecureUrl | base.PublicUrl]];
      caption?: Segment[];
   };
   /**  Defined if the user uploaded an image. */
   file_ids?: base.UUID[];
}

/**
 * Video block.
 */
export interface IVideo extends IBaseSourceBlock {
   type: BlockTypeEnum.Video;
   properties?: {
      /**
       * Normally, the same as `display_source` in {@link BlockFormat}.
       * When they are different, use `display_source`.
       */
      source?: [[base.NotionSecureUrl | base.PublicUrl]];
      caption?: Segment[];
   };
   /**  Defined if the user uploaded a video. */
   file_ids?: base.UUID[];
}

/**
 * Audio block.
 */
export interface IAudio extends IBaseSourceBlock {
   type: BlockTypeEnum.Audio;
   properties?: {
      source: [[base.NotionSecureUrl | base.PublicUrl]];
   };
   /**  Defined if the user uploaded an audio file. */
   file_ids?: base.UUID[];
}

/**
 * File block.
 */
export interface IFile extends IEmptyBlock {
   type: BlockTypeEnum.File;
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

/**
 * Web Bookmark block.
 */
export interface IBookmark extends IBaseTextBlock {
   type: BlockTypeEnum.Bookmark;
   properties?: {
      /** Link of the bookmarked web page. */
      link: [[string]];
      /** Title of the bookmarked web page, auto detected. */
      title?: Segment[];
      /** Description of the bookmarked web page, auto detected. */
      description?: [[string]];
   };
}

/**
 * Code block.
 */
export interface ICode extends IBaseTextBlock {
   type: BlockTypeEnum.Code;
   properties?: {
      /** Code content. */
      title?: Segment[];
      language?: [[string]];
   };
}
