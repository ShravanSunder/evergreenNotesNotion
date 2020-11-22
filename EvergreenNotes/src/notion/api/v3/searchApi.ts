import { getAppState } from 'aNotion/providers/appDispatch';
import { currentPageSelector } from 'aNotion/providers/storeSelectors';
import superagent from 'superagent';
import {
   ISearchFilters,
   Type,
   SearchSort,
   ISearchResultsType,
} from './apiRequestTypes';
import { addAbortSignal } from 'aUtilities/apiHelper';

export const searchByRelevance = async (
   query: string,
   spaceId: string,
   pageTitlesOnly: boolean = true,
   limit: number = 10,
   sort: SearchSort = SearchSort.Relevance,
   abort: AbortSignal | undefined = undefined
): Promise<ISearchResultsType> => {
   let filters = defaultFilters();
   filters.isNavigableOnly = pageTitlesOnly;

   let req = superagent
      .post('https://www.notion.so/api/v3/search')
      .send(createParam(spaceId!, query, filters, sort, limit));

   if (abort != null) {
      addAbortSignal(req, abort);
   }

   return (await req).body;
};

const createParam = (
   spaceId: string,
   query: string,
   filters: ISearchFilters,
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

const defaultFilters = (): ISearchFilters => {
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
