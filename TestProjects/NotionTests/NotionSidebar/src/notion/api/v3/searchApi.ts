import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { CookieData } from 'aNotion/components/NotionSiteTypes';
import { appDispatch, getAppState } from 'aNotion/redux/reduxStore';
import { cookieSelector } from 'aNotion/redux/rootReducer';
import superagent from 'superagent';
import {
   SearchFilters,
   Type,
   SearchSort,
   SearchResultsType,
} from './SearchApiTypes';

export const searchForTitle = async (
   query: string,
   pageTitlesOnly: boolean = true,
   limit: number = 10,
   sort: SearchSort = SearchSort.relevance
): Promise<SearchResultsType> => {
   let userData = getAppState(cookieSelector).data as CookieData;
   let filters = defaultFilters();
   filters.isNavigableOnly = pageTitlesOnly;

   let response = await superagent
      .post('https://www.notion.so/api/v3/search')
      .send(createParam(userData, query, filters, sort, limit));
   return response.body;
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
      sort: SearchSort.relevance,
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
