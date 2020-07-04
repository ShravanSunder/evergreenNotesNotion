import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { cookieSelector } from 'aNotion/redux/rootReducer';

export const UnlinkedReferences = () => {
   const state = useSelector(cookieSelector);
   return <div>{state.data?.spaceId}</div>;
};
