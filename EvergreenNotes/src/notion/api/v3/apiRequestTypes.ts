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

export interface syncRecordType {
   recordVersionMap: {
      block: {
         [key: string]: number;
      };
   };
}

export interface BacklinkType {
   block_id: string;
   mentioned_from: {
      type: 'property_mention';
      block_id: string;
      property_id: string;
   };
}

export interface BacklinkRecordType {
   backlinks: BacklinkType[];
   recordMap: RecordMap;
}
