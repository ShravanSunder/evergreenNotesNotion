import { NotionBlockModel } from './NotionBlock';

export interface NotionPageMarks {
   pageId: string;
   highlights: NotionBlockModel[];
   quotes: NotionBlockModel[];
   todos: NotionBlockModel[];
   events: NotionBlockModel[];

   userMentions: NotionBlockModel[];
   code: NotionBlockModel[];
   pageMentions: NotionBlockModel[];
   links: NotionBlockModel[];
   comments: NotionBlockModel[];
}

export interface CurrentPage {
   record: NotionBlockModel;
   spaceId: string;
}
