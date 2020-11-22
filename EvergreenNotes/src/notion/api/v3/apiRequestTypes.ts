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

export interface ISearchFilters {
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

export interface ISearchResultType {
   id: string;
   isNavigable: boolean;
   score: number;
   highlight: {
      pathText: string;
      text: string;
   };
}

export interface ISearchResultsType {
   recordMap: RecordMap;
   results: ISearchResultType[];
   total: number;
}

export interface ISyncRecordType {
   recordVersionMap: {
      block: {
         [key: string]: number;
      };
   };
}

export interface IBacklinkType {
   block_id: string;
   mentioned_from: {
      type: 'property_mention' | 'collection_reference';
      block_id: string;
      property_id: string;
   };
}

export interface IBacklinkRecordType {
   backlinks: IBacklinkType[];
   recordMap: RecordMap;
}
