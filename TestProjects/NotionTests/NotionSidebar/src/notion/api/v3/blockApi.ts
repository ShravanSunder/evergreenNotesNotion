import superagent from 'superagent';
import * as LoadPageChunk from 'aNotion/types/notionV3/notionRecordTypes';
import { addAbortSignal } from 'aUtilities/restApi';

export const loadPageChunk = async (
   pageId: string,
   limit: number = 1,
   abort: AbortSignal
): Promise<LoadPageChunk.PageChunk> => {
   let req = superagent
      .post('https://www.notion.so/api/v3/loadPageChunk')
      .send({
         pageId: pageId,
         limit: limit,
         chunkNumber: 0,
         verticalColumns: false,
      });

   addAbortSignal(req, abort);

   return (await req).body;
};
