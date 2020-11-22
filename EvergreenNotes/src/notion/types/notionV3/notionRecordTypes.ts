import { Table, UUID } from 'aNotion/types/notionV3/notionBaseTypes';
import * as blockTypes from 'aNotion/types/notionV3/notionBlockTypes';

export type Record<T> = {
   role: unknown; //Permission.Role
   /** Undefined if `role` is "none". */
   value?: T;
};

export type BlockRecord = Record<blockTypes.Block>;
export type CollectionRecord = Record<blockTypes.ICollection>;
export type CollectionViewRecord = Record<blockTypes.ICollectionView>;
export type SpaceRecord = Record<blockTypes.ISpace>;
export type SpaceViewRecord = Record<blockTypes.ISpaceView>;
//export type ActivityRecord = Record<blockTypes.Activity>;
export type NotionUserRecord = Record<blockTypes.INotionUser>;
// export type UserRootRecord = Record<UserRoot>;
// export type UserSettingsRecord = Record<UserSettings>;
// export type FollowRecord = Record<Follow>;
// export type SlackIntegrationRecord = Record<SlackIntegration>;

export interface ICursorItem {
   table: Table;
   id: UUID;
   index: number;
}

export interface ICursor {
   stack: ICursorItem[][];
}

export interface IRecordMap {
   block: { [key: string]: BlockRecord };
   collection?: { [key: string]: CollectionRecord };
   collection_view?: { [key: string]: CollectionViewRecord };
   notion_user?: { [key: string]: NotionUserRecord };
   space: { [key: string]: SpaceRecord };
}

export interface IPageChunk {
   cursor?: ICursor;
   recordMap: IRecordMap;
}
