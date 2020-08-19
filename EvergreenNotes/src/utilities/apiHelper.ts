import superagent from 'superagent';

export const addAbortSignal = (
   req: superagent.SuperAgentRequest,
   signal: AbortSignal
) =>
   req.on('progress', () => {
      if (signal != null && signal.aborted) {
         req.abort();
         console.log('abort');
      }
   });
