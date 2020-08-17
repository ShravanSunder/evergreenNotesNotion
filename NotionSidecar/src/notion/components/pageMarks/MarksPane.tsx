import React, { useEffect, MouseEvent, useState, Suspense } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import {
   currentRecordSelector,
   pageMarksSelector,
} from 'aNotion/providers/storeSelectors';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { LoadingSection } from '../common/Loading';
import BlockUi from '../blocks/BlockUi';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      sections: {
         marginLeft: 6,
         marginTop: 12,
         marginBottom: 6,
      },
   })
);

// comment
export const MarksPane = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const record = useSelector(currentRecordSelector, shallowEqual);
   const { pageMarks, status } = useSelector(pageMarksSelector, shallowEqual);
   const pageName = record.pageRecord?.simpleTitle;
   const pageId = record.pageRecord?.blockId as string;

   let refeStyles = useStyles();

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && (
               <React.Fragment>
                  {pageMarks?.highlights?.map((p, i) => (
                     <BlockUi key={p.blockId} block={p} index={i}></BlockUi>
                  ))}
               </React.Fragment>
            )}
            {status === thunkStatus.pending && <LoadingSection />}
         </Suspense>
      </ErrorBoundary>
   );
};

export default MarksPane;
