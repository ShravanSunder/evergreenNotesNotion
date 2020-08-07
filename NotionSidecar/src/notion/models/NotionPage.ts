import { NotionBlockModel } from './NotionBlock';

export interface NotionPage {
   highlights: NotionBlockModel[];
   pageId: string;
   todos: NotionBlockModel[];
   events: NotionBlockModel[];
   mentions: NotionBlockModel[];
}
