import { RecordMap } from 'aNotion/types/notionV3/notionRecordTypes';
import { NotionBlockModel, NotionBlockRecord } from './NotionBlock';
import { SearchResultType } from 'aNotion/api/v3/apiRequestTypes';
import * as blockService from 'aNotion/services/blockService';

export interface SearchRecordModel {
   id: string;
   isNavigable: boolean;
   score: number;
   highlight: { text: string; pathText: string };
   notionBlock: NotionBlockModel;
   text: string;
   textByContext: string[];
   path: NotionBlockModel[];
}

export class SearchRecord implements SearchRecordModel {
   id: string;
   isNavigable: boolean;
   score: number;
   highlight: { text: string; pathText: string };
   notionBlock: NotionBlockRecord;
   textByContext: string[] = [];
   text: string = '';
   path: NotionBlockModel[] = [];

   constructor(data: RecordMap, searchResult: SearchResultType) {
      this.id = searchResult.id;
      this.isNavigable = searchResult.isNavigable;
      this.highlight = searchResult.highlight;
      this.score = searchResult.score;
      this.notionBlock = new NotionBlockRecord(data, this.id);
      this.cleanHighlight();
      this.fetchPath();
   }

   cleanHighlight() {
      this.textByContext = this.highlight.text
         .split(/(<gzkNfoUU>|<\/gzkNfoUU>)/)
         .filter((x) => !x.includes('gzkNfoUU'));
      this.text = this.highlight.text.split('<gzkNfoUU>').join('');
      this.text = this.text.split('</gzkNfoUU>').join('');
   }

   fetchPath() {
      let path = (this.notionBlock as NotionBlockRecord).getParentsNodes();

      this.path = path.filter(
         (x) =>
            x.simpleTitle != null &&
            x.simpleTitle.length > 0 &&
            blockService.isNavigable(x)
      );
   }

   toSerializable = (): SearchRecordModel => {
      let model: SearchRecordModel = {
         id: this.id,
         isNavigable: this.isNavigable,
         score: this.score,
         highlight: this.highlight,
         textByContext: this.textByContext,
         text: this.text,
         path: this.path.map((p) => (p as NotionBlockRecord).toSerializable()),
         notionBlock: (this.notionBlock as NotionBlockRecord).toSerializable(),
      };
      return model;
   };
}
