import { Collection } from '../collection';
import * as base from 'aNotion/types/notionV3/notionBaseTypes';

export type SortDirection = 'ascending' | 'descending';

export interface Sort {
   id: base.UUID;
   direction: SortDirection;
   property: Collection.ColumnID;
   type: Collection.ColumnPropertyType;
}
