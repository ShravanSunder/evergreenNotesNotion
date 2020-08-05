import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type RecordState = {
   [key: string]: BlockData;
};

export type BlockData = {
   record: NotionBlockModel[];
   status: thunkStatus;
};
