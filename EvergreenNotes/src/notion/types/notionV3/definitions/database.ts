import * as base from 'aNotion/types/notionV3/notionBaseTypes';
import { EmptyBlock } from './basic_blocks';
import { BlockTypeEnum } from '../BlockTypes';

/**
 * Inline database block or Linked database block.
 */
export interface CollectionViewInline extends EmptyBlock {
   type: BlockTypeEnum.CollectionViewInline;
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

/**
 * Full page database block.
 */
export interface CollectionViewPage extends EmptyBlock {
   type: BlockTypeEnum.CollectionViewPage;
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

export type DatabaseBlockUnion = CollectionViewInline | CollectionViewPage;
