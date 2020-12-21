import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { thunkStatus } from 'aNotion/types/thunkStatus';

export type TUseApiPromise<TResult, TInput> = (
   input: TInput
) => [Promise<TResult>, AbortController];

/**
 * A hook that calls an api as an input (payload) changes based on a debouce

 * It will abort the prior api call and then call the api with the new payload
 * provides a status, result, setInput and current search input as a result.
 * It handles errors and sets the status to rejected
 * @param apiCallback the function that calls the api.  returns a TUseApiPromise
 * @param debounce ms debounce
 * @param maxWait maximum wait time before calling function
 */
export function useApi<TResult, TInput>(
   apiCallback: TUseApiPromise<TResult, TInput>,
   debounce: number = 300,
   maxWait: number = 6000
): [
   thunkStatus,
   TResult | undefined,
   React.Dispatch<React.SetStateAction<TInput | undefined>>,
   TInput | undefined
] {
   const [input, setInput] = useState<TInput>();
   const [debouncedInput] = useDebounce(input, debounce, {
      trailing: true,
      maxWait: maxWait,
   });
   const [promise, setPromise] = useState<Promise<TResult>>();
   const [apiAbortController, setAbortController] = useState<AbortController>();
   const [result, setResult] = useState<TResult>();
   const [status, setStatus] = useState<thunkStatus>(thunkStatus.idle);
   const [retry, setRetry] = useState(0);

   useEffect(() => {
      (async () => {
         if (debouncedInput != null && apiCallback != null) {
            console.log(debouncedInput);
            //you can also check for max retries here
            if (
               (status === thunkStatus.rejected && retry <= 3) ||
               status == thunkStatus.idle ||
               status == thunkStatus.pending ||
               status == thunkStatus.fulfilled
            ) {
               setStatus(thunkStatus.pending);
               setResult(undefined);
               if (promise != null && apiAbortController != null) {
                  apiAbortController.abort();
               }

               let [resultPromise, ab] = apiCallback(debouncedInput);
               setPromise(resultPromise);
               setAbortController(ab);
               try {
                  let result = await resultPromise;
                  setStatus(thunkStatus.fulfilled);
                  setResult(result);
                  setPromise(undefined);
                  setAbortController(undefined);
                  setRetry(0);
               } catch (err) {
                  if (err.message !== 'Aborted') {
                     setStatus(thunkStatus.rejected);
                     setResult(undefined);
                     setRetry(retry + 1);
                     setPromise(undefined);
                     setAbortController(undefined);
                  }
               }
            }
         }
      })();
   }, [debouncedInput]);

   return [status, result, setInput, debouncedInput];
}
