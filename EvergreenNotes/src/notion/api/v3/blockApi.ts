import superagent from 'superagent';
import * as LoadPageChunk from 'aNotion/types/notionV3/notionRecordTypes';
import { addAbortSignal } from 'aUtilities/apiHelper';
import { superagentCache } from 'aUtilities/apiCache';
import { ISyncRecordType } from './apiRequestTypes';

export const loadPageChunk = async (
   pageId: string,
   limit: number = 50,
   abort: AbortSignal,
   retry: boolean = true
): Promise<LoadPageChunk.IPageChunk> => {
   let req = superagent
      .post('https://www.notion.so/api/v3/loadPageChunk')
      .use(superagentCache)
      .send({
         pageId: pageId,
         limit: limit,
         chunkNumber: 0,
         verticalColumns: false,
      });

   addAbortSignal(req, abort);

   const data = (await req).body;
   return data;
};

export const syncRecordValues = async (
   pageIds: string[],
   abort: AbortSignal
): Promise<LoadPageChunk.IPageChunk> => {
   let reqData: ISyncRecordType = {
      recordVersionMap: {
         block: {},
      },
   };
   pageIds.forEach((id) => {
      reqData.recordVersionMap.block[id] = -1;
   });

   let req = superagent
      .post('https://www.notion.so/api/v3/syncRecordValues')
      .use(superagentCache)
      .send(reqData);

   addAbortSignal(req, abort);

   return (await req).body;
};
