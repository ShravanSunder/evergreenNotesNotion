import { cookieActions } from 'aNotion/redux/cookieSlice';
import { CookieData } from 'aNotion/types/CookieData';
import { appDispatch, getAppState } from 'aNotion/redux/reduxStore';
import { cookieSelector } from 'aNotion/redux/rootReducer';
import superagent from 'superagent';

export enum ApiType {
   blocksInspace = 'BlocksInSpace',
}

var data = {
   type: 'BlocksInSpace',
   query: 'week',
   spaceId: '8c4bb92b-8b88-4caa-9168-93ebe20f619c',
   limit: 20,
   filters: {
      isDeletedOnly: false,
      excludeTemplates: false,
      isNavigableOnly: false,
      requireEditPermissions: false,
      ancestors: [],
      createdBy: [],
      editedBy: [],
      lastEditedTime: {},
      createdTime: {},
   },
   sort: 'Relevance',
   source: 'quick_find',
};

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

export const searchForTitle = async () => {
   let limit = 10;
   let userData = getAppState(cookieSelector).data as CookieData;
   let filters = commonFilters();
   let response = await superagent
      .post('https://www.notion.so/api/v3/search')
      .send(createParam(userData, 'note', filters, limit));
   console.log(response.body);
};

const createParam = (
   userData: CookieData,
   query: string,
   filters: SearchFilters,
   limit: number
) => {
   let q = {
      query,
      type: ApiType.blocksInspace,
      spaceId: userData.spaceId,
      limit,
      filters,
      sort: SearchSort.relevance,
   };
   return q;
};

const commonFilters = (): SearchFilters => {
   return {
      isDeletedOnly: false,
      excludeTemplates: true,
      isNavigableOnly: true,
      requireEditPermissions: false,
      ancestors: [],
      createdBy: [],
      editedBy: [],
      lastEditedTime: {},
      createdTime: {},
   };
};

var data = {
   type: 'BlocksInSpace',
   query: 'search',
   spaceId: '8c4bb92b-8b88-4caa-9168-93ebe20f619c',
   limit: 20,
   filters: {
      isDeletedOnly: false,
      excludeTemplates: false,
      isNavigableOnly: false,
      requireEditPermissions: false,
      ancestors: [],
      createdBy: [],
      editedBy: [],
      lastEditedTime: {},
      createdTime: {},
   },
   sort: 'Relevance',
   source: 'quick_find',
};
