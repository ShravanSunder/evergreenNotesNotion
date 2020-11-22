import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { INotionPageMarks } from 'aNotion/models/INotionPage';

export type PageMarkState = {
   pageMarks?: INotionPageMarks;
   status: thunkStatus;
};
