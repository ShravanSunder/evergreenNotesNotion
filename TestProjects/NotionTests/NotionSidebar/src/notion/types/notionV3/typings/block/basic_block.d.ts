import { SemanticString, Permission } from '../../notionModels';
import * as base from '../../notionBaseTypes';
import { EmptyBlock } from './empty_block';
import { Collection } from '../collection';
import { BlockNames } from '../../BlockEnums';

/**
 * Embedded Sub-Page block or Link To Page block.
 */
export interface Page extends EmptyBlock {
   type: BlockNames.Page;
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
   type: BlockNames.Text;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Bulleted List block. Editable, can have children.
 */
export interface BulletedList extends EmptyBlock {
   type: BlockNames.ButtetedList;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Numbered List block. Editable, can have children.
 */
export interface NumberedList extends EmptyBlock {
   type: BlockNames.NumberedList;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * To Do block. Editable, can have children.
 */
export interface ToDo extends EmptyBlock {
   type: BlockNames.ToDo;
   properties?: {
      title?: SemanticString[];
      checked?: [['Yes' | 'No']];
   };
}

/**
 * Toggle block. Editable, can have children.
 */
export interface Toggle extends EmptyBlock {
   type: BlockNames.Toggle;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Heading1 block. Editable, can't have children.
 */
export interface Header1 extends EmptyBlock {
   type: BlockNames.Header1;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Heading2 block. Editable, can't have children.
 */
export interface Header2 extends EmptyBlock {
   type: BlockNames.Header2;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Heading3 block. Editable, can't have children.
 */
export interface Header3 extends EmptyBlock {
   type: BlockNames.Header3;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Quote block. Editable, can't have children.
 */
export interface Quote extends EmptyBlock {
   type: BlockNames.Quote;
   properties?: {
      title?: SemanticString[];
   };
}

/**
 * Callout block. Editable, can't have children.
 */
export interface Callout extends EmptyBlock {
   type: BlockNames.Callout;
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
   type: BlockNames.ColumnList;
}

/**
 * Column block. Not editable, can have children.
 *
 * Parent of this block must be {@link ColumnList}.
 */
export interface Column extends EmptyBlock {
   type: BlockNames.Column;
}

/**
 * Divider block. Not editable, can't have children.
 */
export interface Divider extends EmptyBlock {
   type: BlockNames.Divider;
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
   | Divider;
