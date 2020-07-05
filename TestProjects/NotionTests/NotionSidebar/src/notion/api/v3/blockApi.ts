import { notionPageActions } from 'aNotion/services/notionPageSlice';
import { CookieData } from 'aNotion/services/NotionPageTypes';
import { appDispatch, getAppState } from 'aNotion/redux/reduxStore';
import { cookieSelector } from 'aNotion/redux/rootReducer';
import superagent from 'superagent';
import { SearchFilters, Type, SearchSort } from './SearchApiTypes';

export const loadPageChunk = async (pageId: string): LoadPageChunk => {
   let response = await superagent
      .post('https://www.notion.so/api/v3/loadPageChunk')
      .send({
         pageId: pageId,
         limit: 1,
         chunkNumber: 0,
         verticalColumns: true,
      });
   console.log(response.body);
   return response.body;
};

// {
//    "pageId": "ae094404-f2c3-4274-8ffe-9cf93b0bfcea",
//    "limit": 1,
//    "chunkNumber": 100,
//    "verticalColumns": true
// }
