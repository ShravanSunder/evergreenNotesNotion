import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { cookieSelector } from 'aNotion/redux/rootReducer';
import { UnlinkedReferences } from './noteReferences/UnlinkedReferences';

export const Layout = () => {
   return <UnlinkedReferences />;
};
