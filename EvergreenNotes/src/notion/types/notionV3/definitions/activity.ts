import * as base from 'aNotion/types/notionV3/notionBaseTypes';
import { Block } from 'aNotion/types/notionV3/notionBlockTypes';
import { Collection } from './collection';

export type EditType =
   | 'block-created'
   | 'block-changed'
   | 'collection-view-created'
   | 'collection-view-changed'
   | 'collection-property-deleted';

export interface EditAuthor {
   /** Usually "notion_user". */
   table: base.Table;
   id: base.UUID;
}

/**
 * If the edited block is a page in a collection, it has additional
 * block_schema and collection_id property
 */
export interface AbstractEdit {
   type: EditType;
   authors: EditAuthor[];
   navigable_block_id: base.UUID;
   block_id?: base.UUID;
   block_schema?: any; //Collection.CollectionSchema;
   collection_id?: base.UUID;
   collection_property_id?: base.UUID;
   collection_property_data?: Pick<Collection.ColumnProperty, 'name' | 'type'>;
   space_id: base.UUID;
   user_ids: base.UUID[];
   timestamp: base.TimestampNumber;
}

/**
 * A "block-created" edit
 */
export interface BlockCreatedEdit extends AbstractEdit {
   type: 'block-created';
   block_data: {
      block_value: Block;
   };
}

/**
 * A "block-changed" edit
 */
export interface BlockChangedEdit extends AbstractEdit {
   type: 'block-changed';
   block_data: {
      after: { block_value: Block };
      before: { block_value: Block };
   };
}

export type ActivityType =
   | 'block-edited'
   | 'collection-edited'
   | 'collection-view-edited'
   | 'collection-row-created'
   | 'collection-property-edited';

export type Edit = BlockCreatedEdit | BlockChangedEdit;

/**
 * TODO: Icomplete or may be incorrect.
 *
 * If the activity is collection-related, it has additional
 * collection_id property, also all its edits are collection-related.
 */
export interface i_Activity {
   id: base.UUID;
   version: number;
   index: number;
   type: ActivityType;
   parent_table: base.Table;
   parent_id: base.UUID;
   start_time: base.TimestampString;
   end_time: base.TimestampString;
   /** Usually false. */
   invalid: boolean;
   /** Which types of "block" are navigable ? */
   navigable_block_id?: base.UUID;
   collection_id?: base.UUID;
   collection_row_id?: base.UUID;
   collection_view_id?: base.UUID;
   collection_property_id?: base.UUID;
   space_id?: base.UUID;
   edits: Edit[];
}
