import * as base from '../baseNotionTypes';

export interface SpaceView {
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
