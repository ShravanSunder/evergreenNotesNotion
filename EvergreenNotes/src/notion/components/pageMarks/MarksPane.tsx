import React, { useEffect, MouseEvent, useState, Suspense } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import {
   currentRecordSelector,
   pageMarksSelector,
} from 'aNotion/providers/storeSelectors';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { LoadingSection } from '../common/Loading';
import BlockUi from '../blocks/BlockUi';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      sections: {
         marginLeft: 6,
         marginTop: 15,
         marginBottom: 6,
      },
      spacing: {
         marginBottom: 24,
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

   let classes = useStyles();

   let highlights =
      pageMarks?.highlights != null && pageMarks?.highlights.length > 0 ? (
         <>
            <Typography className={classes.sections} variant="h5">
               <b>Highlights</b>
            </Typography>
            {pageMarks?.highlights?.map((p, i) => (
               <BlockUi key={p.blockId} block={p} index={i}></BlockUi>
            ))}
            <div className={classes.spacing}></div>
         </>
      ) : null;

   let quotes =
      pageMarks?.quotes != null && pageMarks?.quotes.length > 0 ? (
         <>
            <Typography className={classes.sections} variant="h5">
               <b>Quotes</b>
            </Typography>
            {pageMarks?.quotes?.map((p, i) => (
               <BlockUi key={p.blockId} block={p} index={i}></BlockUi>
            ))}
            <div className={classes.spacing}></div>
         </>
      ) : null;

   let links =
      pageMarks?.links != null && pageMarks?.links.length > 0 ? (
         <>
            <Typography className={classes.sections} variant="h5">
               <b>Links</b>
            </Typography>
            {pageMarks?.links?.map((p, i) => (
               <BlockUi key={p.blockId} block={p} index={i}></BlockUi>
            ))}
            <div className={classes.spacing}></div>
         </>
      ) : null;

   let code =
      pageMarks?.code != null && pageMarks?.code.length > 0 ? (
         <>
            <Typography className={classes.sections} variant="h5">
               <b>Code</b>
            </Typography>
            {pageMarks?.code?.map((p, i) => (
               <BlockUi key={p.blockId} block={p} index={i}></BlockUi>
            ))}
            <div className={classes.spacing}></div>
         </>
      ) : null;

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && highlights}
            {status === thunkStatus.fulfilled && quotes}
            {status === thunkStatus.fulfilled && links}
            {status === thunkStatus.fulfilled && code}
            {status === thunkStatus.pending && <LoadingSection />}
         </Suspense>
      </ErrorBoundary>
   );
};

export default MarksPane;
