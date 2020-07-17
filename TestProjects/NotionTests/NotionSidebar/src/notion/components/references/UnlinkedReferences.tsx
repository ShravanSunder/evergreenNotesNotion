import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Skeleton } from '@material-ui/lab';

import { Button, Dialog } from '@material-ui/core';
import {
   currentRecordSelector,
   referenceSelector,
} from 'aNotion/providers/rootReducer';
import { referenceActions } from './referenceSlice';
import {
   FetchTitleRefsParams,
   SearchSort,
} from 'aNotion/api/v3/SearchApiTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';

// comment
export const UnlinkedReferences = ({ status, data }: any) => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const record = useSelector(currentRecordSelector, shallowEqual);
   const unlinkedReferences = useSelector(referenceSelector, shallowEqual);
   const pageName = record.pageRecord?.title;

   useEffect(() => {
      if (record.status === thunkStatus.fulfilled && pageName != null) {
         let p: FetchTitleRefsParams = {
            query: pageName,
            pageTitlesOnly: false,
            limit: 50,
            sort: SearchSort.Relevance,
         };
         const pr = dispatch(referenceActions.fetchTitleRefs(p));
         return () => {
            pr.abort();
         };
      } else if (record.status === thunkStatus.pending) {
      }
      return () => {};
   }, [record.status, dispatch, record.pageRecord, pageName]);

   // useEffect(() => {
   //    console.log(unlinkedReferences.results);
   // }, [unlinkedReferences.status, dispatch, unlinkedReferences.results]);

   const handleClick = (e: MouseEvent) => {
      //searchApi.searchForTitle();
   };

   return (
      <div style={{ width: 250, height: 1000 }}>
         {unlinkedReferences.status === thunkStatus.fulfilled &&
            unlinkedReferences.results!.references.map((u) => {
               return <div key={u.id}>{u.highlight.text}</div>;
            })}
         {(unlinkedReferences.status !== thunkStatus.fulfilled ||
            unlinkedReferences.results == null) && (
            <div>
               <Skeleton />
               <Skeleton />
               <Skeleton />
               <Skeleton />
               <Skeleton />
            </div>
         )}
      </div>
   );
};
