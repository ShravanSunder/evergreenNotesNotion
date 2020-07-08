import * as base from '../../notionBaseTypes';
import { BlockFormat } from './block_format';
import { BlockNamesEnum } from '../../BlockEnums';

/**
 * An abstract block, used to hold common properties of all blocks.
 *
 * Doesn't actually exist in Notion.
 */
export interface EmptyBlock {
   id: base.UUID;
   version: number;
   type: BlockNamesEnum;
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
