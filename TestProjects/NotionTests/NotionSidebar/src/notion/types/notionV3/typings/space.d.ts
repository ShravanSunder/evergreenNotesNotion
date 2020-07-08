import { Permission } from './permission';
import * as base from '../notionBaseTypes';

export interface Group {
   id: base.UUID;
   name: string;
   user_ids?: base.UUID[];
}

/**
 * Describe a workspace.
 */
export interface Space {
   id: base.UUID;
   version: number;
   name: string;
   permissions: Permission.UserPermission[];
   permission_groups?: Group[];
   beta_enabled: boolean;
   /** Top level pages. */
   pages: base.UUID[];
   created_by: base.UUID;
   created_time: base.TimestampNumber;
   created_by_table: base.Table;
   created_by_id: base.UUID;
   last_edited_by: base.UUID;
   last_edited_time: base.TimestampNumber;
   last_edited_by_table: base.Table;
   last_edited_by_id: base.UUID;
}
