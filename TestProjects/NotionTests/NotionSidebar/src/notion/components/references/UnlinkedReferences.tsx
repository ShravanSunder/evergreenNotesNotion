import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Button, Dialog } from '@material-ui/core';
import {
   cookieSelector,
   navigationSelector,
   currentRecordSelector,
} from 'aNotion/providers/rootReducer';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { getCurrentUrl } from 'aCommon/extensionHelpers';
import { referenceActions } from './referenceSlice';
import {
   FetchTitleRefsParams,
   SearchSort,
} from 'aNotion/api/v3/SearchApiTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';

// comment
export const UnlinkedReferences = ({ status, data }: any) => {
   let dispatch = useDispatch();
   const record = useSelector(currentRecordSelector, shallowEqual);

   useEffect(() => {
      if (record.status === thunkStatus.fulfilled && record.pageRecord?.name) {
         let p: FetchTitleRefsParams = {
            query: record.pageRecord?.name,
            pageTitlesOnly: true,
            limit: 10,
            sort: SearchSort.Relevance,
         };
         dispatch(referenceActions.fetchTitleRefs(p));
      }
   }, [record.status]);

   const handleClick = (e: MouseEvent) => {
      //searchApi.searchForTitle();
   };

   return (
      <div style={{ width: 100, height: 100 }}>
         <div>{record.pageRecord?.name ?? 'loading...'}</div>
      </div>
   );
};
