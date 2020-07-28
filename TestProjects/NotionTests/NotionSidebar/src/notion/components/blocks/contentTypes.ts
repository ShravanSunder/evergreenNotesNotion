import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type ContentState = {
   [key: string]: ContentBlocksState;
};

export type ContentBlocksState = {
   content: NotionBlockModel[];
   status: thunkStatus;
};
