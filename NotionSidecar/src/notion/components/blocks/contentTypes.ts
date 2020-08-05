import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type ContentState = {
   [key: string]: {
      content: NotionBlockModel[];
      status: thunkStatus;
   };
};

export type RecordState = {
   [key: string]: {
      block?: NotionBlockModel;
      status: thunkStatus;
   };
};
