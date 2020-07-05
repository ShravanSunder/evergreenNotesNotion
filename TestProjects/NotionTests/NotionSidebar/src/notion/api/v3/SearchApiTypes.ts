import { RecordMap } from 'aNotion/typing/notionApi_V3/page';

export enum Type {
   blocksInspace = 'BlocksInSpace',
}

export enum SearchSort {
   relevance = 'Relevance',
   LastEditedOldest = 'LastEditedOldest',
   LastEditedNewest = 'LastEditedNewest',
   CreatedNewest = 'CreatedNewest',
   CreatedOldest = 'CreatedOldest',
}

export interface SearchFilters {
   isDeletedOnly: false;
   excludeTemplates: true;
   isNavigableOnly: boolean;
   requireEditPermissions: false;
   ancestors: [];
   createdBy: [];
   editedBy: [];
   lastEditedTime: {};
   createdTime: {};
}

export interface SearchResultType {
   id: string;
   isNavigable: boolean;
   score: number;
   highlight: {
      pathText: string;
      text: string;
   };
}

export interface SearchResultsType {
   recordMap: RecordMap;
   results: SearchResultType[];
   total: number;
}