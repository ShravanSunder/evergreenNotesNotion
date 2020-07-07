import React, { useEffect, MouseEvent } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Button } from '@material-ui/core';
import {
   cookieSelector,
   navigationSelector,
   currentPageSelector,
} from 'aNotion/redux/rootReducer';
import * as searchApi from 'aNotion/api/v3/searchApi';
import * as blockApi from 'aNotion/api/v3/blockApi';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { getCurrentUrl } from 'aCommon/extensionHelpers';
import { extractNavigationData } from 'aNotion/services/notionSiteService';
import { referenceActions } from './referenceSlice';

// comment
export const UnlinkedReferences = ({ status, data }: any) => {
   let dispatch = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);
   const navigation = useSelector(navigationSelector, shallowEqual);
   const page = useSelector(currentPageSelector, shallowEqual);

   useEffect(() => {
      getCurrentPageId();
   }, [cookie.status]);

   const getCurrentPageId = async () => {
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
   }, [page.status]);

   const handleClick = (e: MouseEvent) => {
      //searchApi.searchForTitle();
   };

   return (
      <div style={{ width: 100, height: 100 }}>
         <Button onClick={handleClick}>NEWBUTTON</Button>
      </div>
   );
};
