import { RecordMap, Record, BlockRecord } from './notionV3/notionRecordTypes';
import { Map } from './notionV3/Map';
import * as blockTypes from './notionV3/notionBlockTypes';
import { BlockTypes, BlockProps } from './notionV3/BlockTypes';
import { NotionBlockModel, NotionBlock } from './NotionBlock';
import { SearchResultType } from 'aNotion/api/v3/SearchApiTypes';
import { createSearchContext } from 'aNotion/components/references/SearchContext';

export interface SearchRecordModel {
   id: string;
   isNavigable: boolean;
   score: number;
   highlight: { text: string; pathText: string };
   notionBlock: NotionBlockModel;
   text: string;
   textByContext: string[];
}

export class SearchRecord implements SearchRecordModel {
   id: string;
   isNavigable: boolean;
   score: number;
   highlight: { text: string; pathText: string };
   notionBlock: NotionBlockModel;
   textByContext: string[] = [];
   text: string = '';

   constructor(data: RecordMap, searchResult: SearchResultType) {
      this.id = searchResult.id;
      this.isNavigable = searchResult.isNavigable;
      this.highlight = searchResult.highlight;
      this.score = searchResult.score;
      this.notionBlock = new NotionBlock(data, this.id);
      this.cleanHighlight(this.highlight);
   }

   cleanHighlight(highlight: { text: string; pathText: string }) {
      this.textByContext = highlight.text
         .split(/(<gzkNfoUU>|<\/gzkNfoUU>)/)
         .filter((x) => !x.includes('gzkNfoUU'));
      this.text = highlight.text.split('<gzkNfoUU>').join('');
      this.text = this.text.split('</gzkNfoUU>').join('');
   }

   toSerializable = (): SearchRecordModel => {
      let model: SearchRecordModel = {
         id: this.id,
         isNavigable: this.isNavigable,
         score: this.score,
         highlight: this.highlight,
         textByContext: this.textByContext,
         text: this.text,
         notionBlock: (this.notionBlock as NotionBlock).toSerializable(),
      };
      return model;
   };
}
