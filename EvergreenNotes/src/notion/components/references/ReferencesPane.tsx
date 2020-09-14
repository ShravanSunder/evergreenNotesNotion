/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState, Suspense } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import {
   currentPageSelector,
   referenceSelector,
   pageMarksSelector,
} from 'aNotion/providers/storeSelectors';
import { referenceActions } from './referenceSlice';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { Reference } from './Reference';
import { ReferenceState, BacklinkRecordModel } from './referenceState';
import { NothingToFind, LoadingSection } from '../common/Loading';
import { Backlink } from './Backlink';
import { PageMarkState } from '../pageMarks/pageMarksState';
import { ErrorBoundary, ErrorFallback } from 'aCommon/Components/ErrorFallback';

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
   const marks = useSelector(pageMarksSelector, shallowEqual);

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
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Backlinks refs={references}></Backlinks>
         <Relations refs={references}></Relations>
         <PageMentions marks={marks}></PageMentions>
         <FullTitle refs={references}></FullTitle>
         <Related refs={references}></Related>
         {references.pageReferencesStatus === thunkStatus.rejected && (
            <div>error!</div>
         )}
      </ErrorBoundary>
   );
};
export default ReferencesPane;

const Backlinks = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let backlinks = refs.pageReferences.backlinks;

   return (
      <Suspense fallback={LoadingSection}>
         {refs.pageReferencesStatus === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
         )}
         {refs.pageReferencesStatus === thunkStatus.fulfilled && (
            <>
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
            </>
         )}
      </Suspense>
   );
};

const Relations = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let relations = refs.pageReferences.relations;

   return (
      <Suspense fallback={LoadingSection}>
         {refs.pageReferencesStatus === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
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
      </Suspense>
   );
};

const PageMentions = ({ marks }: { marks: PageMarkState }) => {
   let classes = useStyles();

   let mentions = marks.pageMarks?.pageMentions ?? [];
   let status = marks.status;

   return (
      <Suspense fallback={LoadingSection}>
         {status === thunkStatus.pending && <LoadingSection></LoadingSection>}
         {status === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Mentions</b>
               </Typography>
               {mentions.map((u) => {
                  let link: BacklinkRecordModel = {
                     backlinkBlock: u,
                     path: [],
                  };
                  return <Backlink key={u.blockId} backlink={link}></Backlink>;
               })}
               {mentions.length === 0 && <NothingToFind />}
            </>
         )}
      </Suspense>
   );
};

const FullTitle = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let fullTitle = refs.pageReferences.references.fullTitle;

   return (
      <Suspense fallback={LoadingSection}>
         {refs.pageReferencesStatus === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
         )}
         {refs.pageReferencesStatus === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Related Search</b>
               </Typography>
               {fullTitle.map((u) => {
                  return <Reference key={u.id} refData={u}></Reference>;
               })}
               {fullTitle.length === 0 && <NothingToFind />}
            </>
         )}
      </Suspense>
   );
};

const Related = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let data = refs.pageReferences.references.related;

   return (
      <Suspense fallback={LoadingSection}>
         {refs.pageReferencesStatus === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
         )}
         {refs.pageReferencesStatus === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Additional Search Results</b>
               </Typography>
               {data.map((u) => {
                  return <Reference key={u.id} refData={u}></Reference>;
               })}
               {data.length === 0 && <NothingToFind />}
            </>
         )}
      </Suspense>
   );
};
