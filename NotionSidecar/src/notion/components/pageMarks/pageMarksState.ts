import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { NotionPageMarks } from 'aNotion/models/NotionPage';

export type PageMarkState = {
   pageMarks?: NotionPageMarks;
   status: thunkStatus;
};
