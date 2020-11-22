import * as base from 'aNotion/types/notionV3/notionBaseTypes';
import { IEmptyBlock } from './basic_blocks';
import { BlockTypeEnum } from '../BlockTypes';

/**
 * Inline database block or Linked database block.
 */
export interface ICollectionViewInline extends IEmptyBlock {
   type: BlockTypeEnum.CollectionViewInline;
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

/**
 * Full page database block.
 */
export interface ICollectionViewPage extends IEmptyBlock {
   type: BlockTypeEnum.CollectionViewPage;
   view_ids: base.UUID[];
   collection_id: base.UUID;
}

export type TDatabaseBlockUnion = ICollectionViewInline | ICollectionViewPage;
