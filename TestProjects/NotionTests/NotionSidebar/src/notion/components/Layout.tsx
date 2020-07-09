import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { cookieSelector } from 'aNotion/providers/rootReducer';
import { UnlinkedReferences } from './references/UnlinkedReferences';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';

//loading fonts recommended by material ui
import 'fontsource-roboto/latin-300.css';
import 'fontsource-roboto/latin-400.css';
import 'fontsource-roboto/latin-500.css';
import 'fontsource-roboto/latin-700.css';

export const Layout = () => {
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <UnlinkedReferences />
      </ErrorBoundary>
   );
};
