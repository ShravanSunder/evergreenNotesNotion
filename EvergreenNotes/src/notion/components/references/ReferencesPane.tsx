/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState, Suspense } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import {
   currentPageSelector,
   referenceSelector,
   pageMarksSelector,
   sidebarExtensionSelector,
} from 'aNotion/providers/storeSelectors';
import { referenceActions } from 'aNotion/components/references/referenceSlice';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { Reference } from './Reference';
import {
   ReferenceState,
   BacklinkRecordModel,
} from 'aNotion/components/references/referenceState';
import {
   NothingToFind,
   LoadingSection,
   ErrorCouldNotLoadReferences,
   AccessIssue,
   LoadingTheNotionPage,
   WaitingToLoadNotionSite,
   ErrorCouldNotLoadEvergreenNotes,
} from 'aNotion/components/common/Loading';
import { Backlink } from 'aNotion/components/references/Backlink';
import { PageMarkState } from 'aNotion/components/pageMarks/pageMarksState';
import { ErrorBoundary, ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { useDebounce } from 'use-debounce/lib';
import { updateStatus } from 'aNotion/types/updateStatus';
import { calculateSidebarStatus } from 'aNotion/services/notionSiteService';
import { PageMention } from './PageMention';

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
   const currentPage = useSelector(currentPageSelector, shallowEqual);
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);
   const references = useSelector(referenceSelector, shallowEqual);
   const marks = useSelector(pageMarksSelector, shallowEqual);

   const pageName = currentPage.currentPageData?.pageBlock?.simpleTitle;
   const pageId = currentPage.currentPageData?.pageBlock?.blockId;
   const [debouncedPage] = useDebounce(
      { pageId, pageName, updateReferences: sidebar.status.updateReferences },
      500,
      {
         trailing: true,
      }
   );

   useEffect(() => {
      if (
         currentPage.status === thunkStatus.fulfilled &&
         debouncedPage.updateReferences === updateStatus.shouldUpdate &&
         debouncedPage?.pageId != null &&
         debouncedPage?.pageName != null &&
         references.status !== thunkStatus.pending
      ) {
         dispatch(
            referenceActions.fetchRefsForPage({
               query: debouncedPage.pageName!,
               pageId: debouncedPage.pageId!,
            })
         );
      }
   }, [dispatch, debouncedPage, sidebar.status.updateReferences]);

   //use sidebar.sidebarStatus.webpageStatus to not show things

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={WaitingToLoadNotionSite}>
            {calculateSidebarStatus(sidebar.status) !== thunkStatus.pending && (
               <>
                  {references.status !== thunkStatus.rejected && (
                     <>
                        <Backlinks refs={references}></Backlinks>
                        <Mentions marks={marks}></Mentions>
                        <Relations refs={references}></Relations>
                        <FullTitle refs={references}></FullTitle>
                        <Related refs={references}></Related>
                     </>
                  )}
                  {references.status === thunkStatus.rejected && (
                     <ErrorCouldNotLoadReferences />
                  )}
               </>
            )}
         </Suspense>
      </ErrorBoundary>
   );
};
export default ReferencesPane;

const Backlinks = ({ refs }: { refs: ReferenceState }) => {
   let classes = useStyles();

   let backlinks = refs.pageReferences.backlinks;

   return (
      <Suspense fallback={LoadingSection}>
         {refs.status === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
         )}
         {refs.status === thunkStatus.fulfilled && (
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
         {refs.status === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
         )}
         {refs.status === thunkStatus.fulfilled && relations.length !== 0 && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Database Relations</b>
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

const Mentions = ({ marks }: { marks: PageMarkState }) => {
   let classes = useStyles();

   let mentions = marks.pageMarks?.pageMentions ?? [];
   let status = marks.status;

   return (
      <Suspense fallback={LoadingSection}>
         {status === thunkStatus.pending && <LoadingSection></LoadingSection>}
         {status === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>@Mentions in Page</b>
               </Typography>
               {mentions.map((u) => {
                  return (
                     <PageMention
                        key={u.blockId}
                        mentionBlock={u}></PageMention>
                  );
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
         {refs.status === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
         )}
         {refs.status === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Unlinked References</b>
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
         {refs.status === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
         )}
         {refs.status === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Similar Notes</b>
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
