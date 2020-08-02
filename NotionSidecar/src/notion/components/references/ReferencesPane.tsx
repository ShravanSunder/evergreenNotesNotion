import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Skeleton } from '@material-ui/lab';

import {
   Button,
   Dialog,
   List,
   ListItem,
   ListItemText,
   Typography,
   withStyles,
   makeStyles,
   createStyles,
   Theme,
} from '@material-ui/core';
import {
   currentRecordSelector,
   referenceSelector,
} from 'aNotion/providers/storeSelectors';
import { referenceActions } from './referenceSlice';
import { SearchSort } from 'aNotion/api/v3/SearchApiTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { Reference } from './Reference';
import { ReferenceState } from './referenceTypes';

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
export const ReferencesPane = ({ status, data }: any) => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const record = useSelector(currentRecordSelector, shallowEqual);
   const references = useSelector(referenceSelector, shallowEqual);
   const pageName = record.pageRecord?.simpleTitle;
   const pageId = record.pageRecord?.blockId as string;

   let refeStyles = useStyles();
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
      <div style={{ height: '100%', width: '100%' }}>
         <FullReferences references={references}></FullReferences>
         <RelatedReferences references={references}></RelatedReferences>
         {references.status === thunkStatus.rejected && <div>error!</div>}
      </div>
   );
};

const FullReferences = ({ references }: { references: ReferenceState }) => {
   let refeStyles = useStyles();

   return (
      <React.Fragment>
         <Typography className={refeStyles.sections} variant="h5">
            <b>References</b>
         </Typography>
         {references.status === thunkStatus.pending && (
            <div>
               <Skeleton />
               <Skeleton />
               <Skeleton />
            </div>
         )}
         {references.status === thunkStatus.fulfilled &&
            references.pageReferences.direct.map((u) => {
               return (
                  <Reference key={u.searchRecord.id} refData={u}></Reference>
               );
            })}
         {references.status === thunkStatus.fulfilled &&
            references.pageReferences.fullTitle.map((u) => {
               return (
                  <Reference key={u.searchRecord.id} refData={u}></Reference>
               );
            })}
      </React.Fragment>
   );
};

const RelatedReferences = ({ references }: { references: ReferenceState }) => {
   let refeStyles = useStyles();
   return (
      <React.Fragment>
         <Typography className={refeStyles.sections} variant="h5">
            <b>Related Searches</b>
         </Typography>
         {references.status === thunkStatus.pending && (
            <div>
               <Skeleton />
               <Skeleton />
               <Skeleton />
            </div>
         )}
         {references.status === thunkStatus.fulfilled &&
            references.pageReferences.related.map((u) => {
               return (
                  <Reference key={u.searchRecord.id} refData={u}></Reference>
               );
            })}
      </React.Fragment>
   );
};
