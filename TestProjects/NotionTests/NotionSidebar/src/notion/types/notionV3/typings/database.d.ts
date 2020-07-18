import * as base from '../notionBaseTypes';
import { EmptyBlock } from './basic_blocks';
import { BlockTypes } from '../BlockTypes';

/**
 * Inline database block or Linked database block.
 */
export interface CollectionViewInline extends EmptyBlock {
   type: BlockTypes.CollectionViewInline;
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

/**
 * Full page database block.
 */
export interface CollectionViewPage extends EmptyBlock {
   type: BlockTypes.CollectionViewPage;
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

export type DatabaseBlockUnion = CollectionViewInline | CollectionViewPage;
