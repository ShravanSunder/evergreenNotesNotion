import superagent from 'superagent';

export const addAbortSignal = (
   req: superagent.SuperAgentRequest,
   signal: AbortSignal
) =>
   req.on('progress', () => {
      if (signal != null && signal.aborted) {
         try {
            //req.abort();
            //console.log('signaled to aborted api request');
         } catch {}
      }
   });
