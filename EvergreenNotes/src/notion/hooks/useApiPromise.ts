import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type UseApiPromise<TResult, TInput> = (
   input: TInput
) => [Promise<TResult>, AbortController];

export function useApi<TResult, TInput>(
   apiCallback: UseApiPromise<TResult, TInput>
): [
   thunkStatus,
   TResult | undefined,
   React.Dispatch<React.SetStateAction<TInput | undefined>>,
   TInput | undefined
] {
   const [input, setInput] = useState<TInput>();
   const [debouncedInput] = useDebounce(input, 333, {
      trailing: true,
   });
   const [lastApiPaylod, setLastApiPayload] = useState<TInput>();
   const [apiAbortController, setAbortController] = useState<AbortController>();
   const [result, setResult] = useState<TResult>();
   const [status, setStatus] = useState<thunkStatus>(thunkStatus.idle);

   useEffect(() => {
      (async () => {
         if (debouncedInput != null && apiCallback != null) {
            console.log(debouncedInput);
            //you can also check for max retries here
            if (
               debouncedInput !== lastApiPaylod ||
               status === thunkStatus.rejected
            ) {
               setStatus(thunkStatus.pending);
               if (
                  apiAbortController != null &&
                  !apiAbortController?.signal.aborted
               ) {
                  apiAbortController.abort();
               }

               let [resultPromise, ab] = apiCallback(debouncedInput);
               setLastApiPayload(debouncedInput);
               setAbortController(ab);
               try {
                  let result = await resultPromise;
                  setStatus(thunkStatus.fulfilled);
                  setResult(result);
                  setAbortController(undefined);
               } catch (err) {
                  if (err.message !== 'Aborted') {
                     setStatus(thunkStatus.rejected);
                     setResult(undefined);
                  }
               }
            }
         }
      })();

      return () => {
         if (apiAbortController != null) {
            apiAbortController.abort();
         }
      };
   }, [
      //input,
      apiAbortController,
      debouncedInput,
      lastApiPaylod,
      apiCallback,
      setAbortController,
      status,
   ]);

   return [status, result, setInput, debouncedInput];
}
