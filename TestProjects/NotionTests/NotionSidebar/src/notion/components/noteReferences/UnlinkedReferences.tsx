import React, { useEffect, MouseEvent } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Button } from '@material-ui/core';
import { cookieSelector } from 'aNotion/redux/rootReducer';
import * as searchApi from 'aNotion/api/v3/searchApi';
import { getCurrentUrl } from 'aCommon/extensionHelpers';
import { extractPageData } from 'aNotion/services/notionPage';

// comment
export const UnlinkedReferences = ({ status, data }: any) => {
   let dispatch = useDispatch();
   const cookie = useSelector(cookieSelector, shallowEqual);

   useEffect(() => {
      getCurrentPageId();
   }, [cookie]);

   const getCurrentPageId = async () => {
      let url = await getCurrentUrl();
      extractPageData(url);
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
