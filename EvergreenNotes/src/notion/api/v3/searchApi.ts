import { getAppState } from 'aNotion/providers/appDispatch';
import { currentPageSelector } from 'aNotion/providers/storeSelectors';
import superagent from 'superagent';
import {
   SearchFilters,
   Type,
   SearchSort,
   SearchResultsType,
} from './apiRequestTypes';
import { addAbortSignal } from 'aUtilities/apiHelper';

export const searchByRelevance = async (
   query: string,
   pageTitlesOnly: boolean = true,
   limit: number = 10,
   sort: SearchSort = SearchSort.Relevance,
   abort: AbortSignal | undefined = undefined
): Promise<SearchResultsType> => {
   let spaceId = getAppState(currentPageSelector).currentPageData?.spaceId;
   let filters = defaultFilters();
   filters.isNavigableOnly = pageTitlesOnly;

   try {
      let req = superagent
         .post('https://www.notion.so/api/v3/search')
         .send(createParam(spaceId!, query, filters, sort, limit));

      if (abort != null) {
         addAbortSignal(req, abort);
      }

      return (await req).body;
   } catch (err) {
      console.log(err);
      throw err;
   }
};

const createParam = (
   spaceId: string,
   query: string,
   filters: SearchFilters,
   sort: SearchSort,
   limit: number
) => {
   let q = {
      query,
      type: Type.blocksInspace,
      spaceId: spaceId,
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
