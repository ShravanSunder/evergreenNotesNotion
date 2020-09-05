import { NotionBlockModel } from './NotionBlock';

export interface NotionPageMarks {
   pageId: string;
   highlights: NotionBlockModel[];
   quotes: NotionBlockModel[];
   todos: NotionBlockModel[];
   events: NotionBlockModel[];
   mentions: NotionBlockModel[];
   code: NotionBlockModel[];
   links: NotionBlockModel[];
   comments: NotionBlockModel[];
}

export interface CurrentPage {
   record: NotionBlockModel;
   spaceId: string;
}
