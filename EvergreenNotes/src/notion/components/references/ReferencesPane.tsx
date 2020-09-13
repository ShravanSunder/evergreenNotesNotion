/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import {
   currentPageSelector,
   referenceSelector,
} from 'aNotion/providers/storeSelectors';
import { referenceActions } from './referenceSlice';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { Reference } from './Reference';
import { ReferenceState, BacklinkRecordModel } from './referenceState';
import { LoadingTab, NothingToFind } from '../common/Loading';
import { Backlink } from './Backlink';

const useStyles = makeStyles(() =>
   createStyles({
      sections: {
         marginLeft: 6,
         marginTop: 36,
         marginBottom: 12,
         fontVariant: 'small-caps',
      },
   })
);

// comment
export const ReferencesPane = () => {
   const dispatch: AppPromiseDispatch<any> = useDispatch();
   const record = useSelector(currentPageSelector, shallowEqual);
   const references = useSelector(referenceSelector, shallowEqual);
   const pageName = record.currentPage?.pageBlock.simpleTitle;
   const pageId = record.currentPage?.pageBlock.blockId as string;

   useEffect(() => {
      if (
         record.status === thunkStatus.fulfilled &&
         pageName != null &&
         pageId != null
      ) {
         const pr = dispatch(
            referenceActions.fetchRefsForPage({ query: pageName, pageId })
         );
         return () => {
            pr.abort();
         };
      } else if (record.status === thunkStatus.pending) {
      }
      return () => {};
   }, [record.status, dispatch, record.currentPage, pageName, pageId]);

   return (
      <>
         <Backlinks refs={references}></Backlinks>
         <Relations refs={references}></Relations>
         <FullTitle refs={references}></FullTitle>
         <Related refs={references}></Related>
         {references.pageReferencesStatus === thunkStatus.rejected && (
            <div>error!</div>
         )}
      </>
   );
};
export default ReferencesPane;

const Backlinks = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let backlinks = refs.pageReferences.backlinks;

   return (
      <React.Fragment>
         {refs.pageReferencesStatus === thunkStatus.pending && (
            <LoadingTab></LoadingTab>
         )}
         {refs.pageReferencesStatus === thunkStatus.fulfilled && (
            <React.Fragment>
               <Typography className={classes.sections} variant="h5">
                  <b>Backlinks</b>
               </Typography>
               {backlinks.map((u) => {
                  return (
                     <Backlink
                        key={u.backlinkBlock.blockId}
                        backlink={u}></Backlink>
                  );
               })}
               {backlinks.length === 0 && <NothingToFind />}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};

const Relations = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let relations = refs.pageReferences.relations;

   return (
      <>
         {refs.pageReferencesStatus === thunkStatus.pending && (
            <LoadingTab></LoadingTab>
         )}
         {refs.pageReferencesStatus === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Relations</b>
               </Typography>
               {relations.map((u) => {
                  let link: BacklinkRecordModel = {
                     backlinkBlock: u,
                     path: [],
                  };
                  return <Backlink key={u.blockId} backlink={link}></Backlink>;
               })}
               {relations.length === 0 && <NothingToFind />}
            </>
         )}
      </>
   );
};

const FullTitle = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let fullTitle = refs.pageReferences.references.fullTitle;

   return (
      <React.Fragment>
         {refs.pageReferencesStatus === thunkStatus.pending && (
            <LoadingTab></LoadingTab>
         )}
         {refs.pageReferencesStatus === thunkStatus.fulfilled && (
            <React.Fragment>
               <Typography className={classes.sections} variant="h5">
                  <b>References</b>
               </Typography>
               {fullTitle.map((u) => {
                  return <Reference key={u.id} refData={u}></Reference>;
               })}
               {fullTitle.length === 0 && <NothingToFind />}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};

const Related = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let data = refs.pageReferences.references.related;

   return (
      <React.Fragment>
         {refs.pageReferencesStatus === thunkStatus.pending && (
            <LoadingTab></LoadingTab>
         )}
         {refs.pageReferencesStatus === thunkStatus.fulfilled && (
            <React.Fragment>
               <Typography className={classes.sections} variant="h5">
                  <b>Related Searches</b>
               </Typography>
               {data.map((u) => {
                  return <Reference key={u.id} refData={u}></Reference>;
               })}
               {data.length === 0 && <NothingToFind />}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};
