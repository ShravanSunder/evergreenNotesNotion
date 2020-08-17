import { Map } from './Map';
import { Table, UUID } from './notionBaseTypes';
import * as blockTypes from './notionBlockTypes';

export type Record<T> = {
   role: unknown; //Permission.Role
   /** Undefined if `role` is "none". */
   value?: T;
};

export type BlockRecord = Record<blockTypes.Block>;
export type CollectionRecord = Record<blockTypes.Collection>;
export type CollectionViewRecord = Record<blockTypes.CollectionView>;
export type SpaceRecord = Record<blockTypes.Space>;
export type SpaceViewRecord = Record<blockTypes.SpaceView>;
export type ActivityRecord = Record<blockTypes.Activity>;
export type NotionUserRecord = Record<blockTypes.NotionUser>;
// export type UserRootRecord = Record<UserRoot>;
// export type UserSettingsRecord = Record<UserSettings>;
// export type FollowRecord = Record<Follow>;
// export type SlackIntegrationRecord = Record<SlackIntegration>;

export interface CursorItem {
   table: Table;
   id: UUID;
   index: number;
}

export interface Cursor {
   stack: CursorItem[][];
}

export interface RecordMap {
   block: { [key: string]: Record<blockTypes.Block> };
   collection?: { [key: string]: Record<blockTypes.Collection> };
   collection_view?: Map<Record<blockTypes.CollectionView>>;
   notion_user?: Map<blockTypes.NotionUser>;
   space: Map<Record<blockTypes.Space>>;
}

export interface PageChunk {
   cursor?: Cursor;
   recordMap: RecordMap;
}
