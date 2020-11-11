import superagent from 'superagent';
import { BacklinkRecordType } from './apiRequestTypes';
import { addAbortSignal } from 'aUtilities/apiHelper';

export const getBacklinks = async (
   blockId: string,
   abort: AbortSignal
): Promise<BacklinkRecordType> => {
   let req = superagent
      .post('https://www.notion.so/api/v3/getBacklinksForBlock')
      .send({ blockId: blockId });

   if (abort != null) {
      addAbortSignal(req, abort);
   }

   return (await req).body;
};
