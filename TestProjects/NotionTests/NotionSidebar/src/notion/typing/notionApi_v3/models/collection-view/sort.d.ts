import { Collection } from '../notionModels';
import * as base from '../../baseTypes';

export type SortDirection = 'ascending' | 'descending';

export interface Sort {
   id: base.UUID;
   direction: SortDirection;
   property: Collection.ColumnID;
   type: Collection.ColumnPropertyType;
}
