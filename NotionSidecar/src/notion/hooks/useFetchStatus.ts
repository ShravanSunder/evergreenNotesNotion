import { thunkStatus } from 'aNotion/types/thunkStatus';
import { useState, useEffect } from 'react';

export const useFetchStatus = <T>(callback: () => T) => {
   const [status, setStatus] = useState(thunkStatus.idle);

   // useEffect(() => {
   //    callback();
   //    return () => {};
   // }, [input]);
};
