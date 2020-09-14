import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type ContentState = {
   [key: string]: {
      content: NotionBlockModel[];
      status: thunkStatus;
   };
};

export type ContentBlocks = {
   blockId: string;
   content: NotionBlockModel[];
   contentIds?: string[];
};
