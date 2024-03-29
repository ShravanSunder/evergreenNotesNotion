import { INotionBlockModel, NotionBlockRecord } from './NotionBlock';

export interface INotionPageMarks {
   pageId: string;
   highlights: INotionBlockModel[];
   quotes: INotionBlockModel[];
   todos: INotionBlockModel[];
   events: INotionBlockModel[];

   userMentions: INotionBlockModel[];
   code: INotionBlockModel[];
   pageMentions: INotionBlockModel[];
   links: INotionBlockModel[];
   comments: INotionBlockModel[];
   headers: INotionBlockModel[];
}

export interface ICurrentPageData {
   pageBlock?: INotionBlockModel;
   spaceId: string | undefined;
}
