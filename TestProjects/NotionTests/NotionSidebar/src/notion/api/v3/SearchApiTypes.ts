import { RecordMap } from 'aNotion/types/notionV3/notionRecordTypes';

export enum Type {
   blocksInspace = 'BlocksInSpace',
}

export enum SearchSort {
   Relevance = 'Relevance',
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

export type FetchTitleRefsParams = {
   query: string;
   pageTitlesOnly: boolean;
   limit: number;
   sort: SearchSort;
};
