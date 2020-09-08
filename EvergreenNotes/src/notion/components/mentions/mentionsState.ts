import { NotionUser } from 'aNotion/types/notionV3/notionBlockTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type MentionsState = {
   users: {
      [key: string]: {
         user?: NotionUser;
         status: thunkStatus;
      };
   };
};
