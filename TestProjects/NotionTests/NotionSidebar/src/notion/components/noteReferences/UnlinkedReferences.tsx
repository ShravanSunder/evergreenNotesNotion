import React, { useEffect, MouseEvent } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Button } from '@material-ui/core';
import { cookieSelector, navigationSelector } from 'aNotion/redux/rootReducer';
import * as searchApi from 'aNotion/api/v3/searchApi';
import * as blockApi from 'aNotion/api/v3/blockApi';
import { getCurrentUrl } from 'aCommon/extensionHelpers';
import { extractPageData } from 'aNotion/services/notionPage';

// comment
export const UnlinkedReferences = ({ status, data }: any) => {
   let dispatch = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);
   const navigation = useSelector(navigationSelector, shallowEqual);

   useEffect(() => {
      getCurrentPageId();
   }, [cookie]);

   const getCurrentPageId = async () => {
      let url = await getCurrentUrl();
      extractPageData(url);
   };

   useEffect(() => {
      callApi();
   }, [navigation.pageId]);

   const callApi = async () => {
      let data = await blockApi.loadPageChunk(navigation.pageId!);
      console.log(data);
   };

   const handleClick = (e: MouseEvent) => {
      //searchApi.searchForTitle();
   };

   return (
      <div style={{ width: 100, height: 100 }}>
         <Button onClick={handleClick}>NEWBUTTON</Button>
      </div>
   );
};
