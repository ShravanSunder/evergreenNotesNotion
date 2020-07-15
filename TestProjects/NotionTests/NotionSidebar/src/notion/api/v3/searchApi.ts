import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { CookieData } from 'aNotion/components/NotionSiteTypes';
import { appDispatch, getAppState } from 'aNotion/providers/reduxStore';
import { cookieSelector } from 'aNotion/providers/rootReducer';
import superagent from 'superagent';
import {
   SearchFilters,
   Type,
   SearchSort,
   SearchResultsType,
} from './SearchApiTypes';

export const searchByRelevance = async (
   query: string,
   pageTitlesOnly: boolean = true,
   limit: number = 10,
   sort: SearchSort = SearchSort.Relevance,
   abort: AbortSignal
): Promise<SearchResultsType> => {
   let userData = getAppState(cookieSelector).data as CookieData;
   let filters = defaultFilters();
   filters.isNavigableOnly = pageTitlesOnly;

   let req = superagent
      .post('https://www.notion.so/api/v3/search')
      .send(createParam(userData, query, filters, sort, limit));

   req.on('progress', () => {
      if (abort.aborted) {
         req.abort();
         console.log('abort');
      }
   });

   return (await req).body;
};

const createParam = (
   userData: CookieData,
   query: string,
   filters: SearchFilters,
   sort: SearchSort,
   limit: number
) => {
   let q = {
      query,
      type: Type.blocksInspace,
      spaceId: userData.spaceId,
      limit,
      filters,
      sort: SearchSort.Relevance,
   };
   return q;
};

const defaultFilters = (): SearchFilters => {
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
