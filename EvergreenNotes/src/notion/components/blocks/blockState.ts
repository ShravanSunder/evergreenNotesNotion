import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type RecordState = {
   [key: string]: {
      block?: NotionBlockModel;
      status: thunkStatus;
   };
};
