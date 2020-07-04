import React, { useEffect, MouseEvent } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { Button } from '@material-ui/core';
import { cookieSelector } from 'aNotion/redux/rootReducer';
import * as searchApi from 'aNotion/Api/searchApi';

// comment
export const UnlinkedReferences = ({ status, data }: any) => {
   const cookie = useSelector(cookieSelector, shallowEqual);

   useEffect(() => {
      //searchApi.
   }, [cookie.status]);

   const handleClick = (e: MouseEvent) => {
      searchApi.searchForTitle();
   };

   return (
      <div style={{ width: 100, height: 100 }}>
         <Button onClick={handleClick}>NEWBUTTON</Button>
      </div>
   );
};

// const mapStateToProps = (state: any, oldProps: any) => {
//    let s = cookieSelector(state);
//    return {
//       status: s.status,
//       data: s.data,
//    };
// };
// const mapDispatchToProps = {};
// export default connect(mapStateToProps)(UnlinkedReferences);
