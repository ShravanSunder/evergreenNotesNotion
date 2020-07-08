import React, { useEffect, MouseEvent } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Button } from '@material-ui/core';
import {
   cookieSelector,
   navigationSelector,
   currentRecordSelector,
} from 'aNotion/providers/rootReducer';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { getCurrentUrl } from 'aCommon/extensionHelpers';

// comment
export const UnlinkedReferences = ({ status, data }: any) => {
   let dispatch = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);
   const navigation = useSelector(navigationSelector, shallowEqual);
   const record = useSelector(currentRecordSelector, shallowEqual);

   useEffect(() => {
      updateCurrentPageId();
   }, [cookie.status]);

   const updateCurrentPageId = async () => {
      let url = await getCurrentUrl();
      dispatch(notionSiteActions.currentPage(url));
   };

   useEffect(() => {
      if (navigation.pageId !== undefined) {
         dispatch(
            notionSiteActions.fetchCurrentPage({
               pageId: navigation.pageId,
               limit: 1,
            })
         );
      }
   }, [navigation.pageId]);

   useEffect(() => {
      //dispatch(referenceActions.fetchTitleRefs({page.}:));
   }, [record.status]);

   const handleClick = (e: MouseEvent) => {
      //searchApi.searchForTitle();
   };

   let m = record.pageRecord?.name ?? '';

   return (
      <div style={{ width: 100, height: 100 }}>
         <Button onClick={handleClick}>{m}</Button>
      </div>
   );
};
