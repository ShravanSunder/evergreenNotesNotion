import { INotionUser } from 'aNotion/types/notionV3/notionBlockTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type MentionsState = {
   users: {
      [key: string]: {
         user?: INotionUser;
         status: thunkStatus;
      };
   };
};
