import React, { useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { cookieSelector } from 'aNotion/redux/rootReducer';

export const UnlinkedReferences = () => {
   const state = useSelector(cookieSelector, () => false);
   return (
      <div style={{ width: 100, height: 100 }}>
         {'lets do this' + state.status + state.data?.token}
      </div>
   );
};
