import superagent from 'superagent';

export const addAbortSignal = (
   req: superagent.SuperAgentRequest,
   abort: AbortSignal
) =>
   req.on('progress', () => {
      if (abort.aborted) {
         req.abort();
         console.log('abort');
      }
   });
