import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type ContentState = {
   [key: string]: {
      content: INotionBlockModel[];
      status: thunkStatus;
   };
};

export type ContentBlocks = {
   blockId: string;
   content: INotionBlockModel[];
   contentIds?: string[];
};
