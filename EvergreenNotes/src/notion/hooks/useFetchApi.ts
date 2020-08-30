import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type UseFetchCallbackType<T> = (
   input: string
) => [Promise<T>, AbortController];

export function useFetchApi<T>(
   searchCallback: UseFetchCallbackType<T>
): [
   thunkStatus,
   T | undefined,
   React.Dispatch<React.SetStateAction<string | undefined>>
] {
   const [input, setInput] = useState<string>();
   const [debouncedInput] = useDebounce(input, 400);
   const [lastApiPaylod, setLastApiPayload] = useState<string>();
   const [apiAbortController, setAbortController] = useState<AbortController>();
   const [result, setResult] = useState<T>();
   const [status, setStatus] = useState<thunkStatus>(thunkStatus.idle);

   useEffect(() => {
      (async () => {
         if (debouncedInput != null && searchCallback != null) {
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

               let [resultPromise, ab] = searchCallback(debouncedInput);
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
      searchCallback,
      setAbortController,
      status,
   ]);

   return [status, result, setInput];
}
