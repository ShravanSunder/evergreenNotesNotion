import { Collection } from '../notionModels';
import * as base from '../../baseNotionTypes';

export type SortDirection = 'ascending' | 'descending';

export interface Sort {
   id: base.UUID;
   direction: SortDirection;
   property: Collection.ColumnID;
   type: Collection.ColumnPropertyType;
}
