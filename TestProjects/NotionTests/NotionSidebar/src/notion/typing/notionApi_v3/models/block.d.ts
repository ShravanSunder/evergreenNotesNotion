import * as AdvancedBlock from './block/advanced_block';
import * as BasicBlock from './block/basic_block';
import * as DatabaseBlock from './block/database';
import * as EmbedBlock from './block/embed';
import * as MediaBlock from './block/media';

/**
 * All types of blocks.
 */
export type Block =
   | AdvancedBlock.AdvancedBlockUnion
   | BasicBlock.BasicBlockUnion
   | DatabaseBlock.DatabaseBlockUnion
   | EmbedBlock.EmbedBlockUnion
   | MediaBlock.MediaBlockUnion;
