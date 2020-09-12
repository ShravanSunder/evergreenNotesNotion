import { Permission } from './permission';
import * as base from 'aNotion/types/notionV3/notionBaseTypes';

export interface Group {
   id: base.UUID;
   name: string;
   user_ids?: base.UUID[];
}

/**
 * Describe a workspace.
 */
export interface i_Space {
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

export interface i_SpaceView {
   id: base.UUID;
   version: number;
   space_id: base.UUID;
   parent_id: base.UUID;
   parent_table: base.Table;
   alive: boolean;
   notify_mobile: boolean;
   notify_desktop: boolean;
   notify_email: boolean;
   /** Template page IDs. */
   visited_templates: base.UUID[];
   /** Template page IDs. */
   sidebar_hidden_templates: base.UUID[];
   created_getting_started: boolean;
}
