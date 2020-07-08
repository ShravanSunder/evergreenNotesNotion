import * as base from '../../notionBaseTypes';
import { EmptyBlock } from './empty_block';
import { BlockNames } from '../../BlockEnums';

/**
 * Inline database block or Linked database block.
 */
export interface CollectionViewInline extends EmptyBlock {
   type: BlockNames.CollectionViewInline;
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

/**
 * Full page database block.
 */
export interface CollectionViewPage extends EmptyBlock {
   type: BlockNames.CollectionViewPage;
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

export type DatabaseBlockUnion = CollectionViewInline | CollectionViewPage;
