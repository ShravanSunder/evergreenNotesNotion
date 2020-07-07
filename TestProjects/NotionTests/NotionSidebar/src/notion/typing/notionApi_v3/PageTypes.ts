import { Map } from './Map';
import { Table, UUID } from './baseNotionTypes';
import * as models from './models/notionModels';

export interface CursorItem {
   table: Table;
   id: UUID;
   index: number;
}

export interface Cursor {
   stack: CursorItem[][];
}

export interface RecordMap {
   block: Map<models.Block>;
   collection?: Map<models.Collection>;
   collection_view?: Map<models.CollectionView>;
   notion_user?: Map<unknown>;
   space: Map<models.Space>;
}

export interface PageChunk {
   cursor?: Cursor;
   recordMap: RecordMap;
}
