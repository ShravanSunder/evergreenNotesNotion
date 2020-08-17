import { CookieData } from 'aNotion/components/layout/NotionSiteState';
import { getAppState } from 'aNotion/providers/appDispatch';
import { cookieSelector } from 'aNotion/providers/storeSelectors';
import superagent from 'superagent';
import {
   SearchFilters,
   Type,
   SearchSort,
   SearchResultsType,
} from './apiReqTypes';
import { addAbortSignal } from 'aUtilities/apiHelper';

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

   try {
      let req = superagent
         .post('https://www.notion.so/api/v3/search')
         .send(createParam(userData, query, filters, sort, limit));

      addAbortSignal(req, abort);

      return (await req).body;
   } catch (err) {
      console.log(err);
      throw err;
   }
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
