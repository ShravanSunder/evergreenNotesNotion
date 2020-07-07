import * as base from '../../baseNotionTypes';
import { EmptyBlock } from './empty_block';

/**
 * Inline database block or Linked database block.
 */
export interface CollectionViewInline extends EmptyBlock {
   type: 'collection_view';
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

/**
 * Full page database block.
 */
export interface CollectionViewPage extends EmptyBlock {
   type: 'collection_view_page';
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

export type DatabaseBlockUnion = CollectionViewInline | CollectionViewPage;
