import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { cookieSelector } from 'aNotion/providers/rootReducer';
import { UnlinkedReferences } from './references/UnlinkedReferences';

export const Layout = () => {
   return <UnlinkedReferences />;
};
