/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import {
   currentRecordSelector,
   referenceSelector,
} from 'aNotion/providers/storeSelectors';
import { referenceActions } from './referenceSlice';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { Reference } from './Reference';
import { ReferenceState } from './referenceState';
import { LoadingTab, NothingToFind } from '../common/Loading';

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
export const ReferencesPane = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const record = useSelector(currentRecordSelector, shallowEqual);
   const references = useSelector(referenceSelector, shallowEqual);
   const pageName = record.pageRecord?.simpleTitle;
   const pageId = record.pageRecord?.blockId as string;

   useEffect(() => {
      if (record.status === thunkStatus.fulfilled && pageName != null) {
         const pr = dispatch(
            referenceActions.fetchRefsForPage({ query: pageName, pageId })
         );
         return () => {
            pr.abort();
         };
      } else if (record.status === thunkStatus.pending) {
      }
      return () => {};
   }, [record.status, dispatch, record.pageRecord, pageName, pageId]);

   return (
      <React.Fragment>
         <FullReferences references={references}></FullReferences>
         <RelatedReferences references={references}></RelatedReferences>
         {references.pageReferencesStatus === thunkStatus.rejected && (
            <div>error!</div>
         )}
      </React.Fragment>
   );
};
export default ReferencesPane;

const FullReferences = ({ references }: { references: ReferenceState }) => {
   let classes = useStyles();

   let fullTitle = references.pageReferences.fullTitle;
   let direct = references.pageReferences.direct;

   return (
      <React.Fragment>
         {references.pageReferencesStatus === thunkStatus.pending && (
            <LoadingTab></LoadingTab>
         )}
         {references.pageReferencesStatus === thunkStatus.fulfilled && (
            <React.Fragment>
               <Typography className={classes.sections} variant="h5">
                  <b>References</b>
               </Typography>
               {direct.map((u) => {
                  return (
                     <Reference key={u.searchRecord.id} refData={u}></Reference>
                  );
               })}
               {fullTitle.map((u) => {
                  return (
                     <Reference key={u.searchRecord.id} refData={u}></Reference>
                  );
               })}
               {fullTitle.length === 0 && direct.length === 0 && (
                  <NothingToFind />
               )}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};

const RelatedReferences = ({ references }: { references: ReferenceState }) => {
   let classes = useStyles();

   let data = references.pageReferences.related;

   return (
      <React.Fragment>
         {references.pageReferencesStatus === thunkStatus.pending && (
            <LoadingTab></LoadingTab>
         )}
         {references.pageReferencesStatus === thunkStatus.fulfilled && (
            <React.Fragment>
               <Typography className={classes.sections} variant="h5">
                  <b>Related Searches</b>
               </Typography>
               {data.map((u) => {
                  return (
                     <Reference key={u.searchRecord.id} refData={u}></Reference>
                  );
               })}
               {data.length === 0 && <NothingToFind />}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};
