/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState, Suspense, useMemo } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import {
   currentPageSelector,
   referenceSelector,
   pageMarksSelector,
   sidebarExtensionSelector,
} from 'aNotion/providers/rootSelectors';
import { referenceActions } from 'aNotion/components/references/referenceSlice';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import {
   TAppDispatchWithPromise,
   TPromiseReturendFromDispatch,
} from 'aNotion/providers/appDispatch';
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

const useStyles = makeStyles((theme: Theme) =>
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
   const dispatch: TAppDispatchWithPromise<any> = useDispatch();

   const currentPage = useSelector(currentPageSelector, shallowEqual);
   const sidebar = useSelector(sidebarExtensionSelector, shallowEqual);
   const references = useSelector(referenceSelector, shallowEqual);
   const marks = useSelector(pageMarksSelector, shallowEqual);

   const [fetchRefsForPagePromise, setFetchRefsForPagePromise] = useState<
      TPromiseReturendFromDispatch
   >();

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
      const validPage =
         currentPage.status === thunkStatus.fulfilled &&
         debouncedPage?.pageId != null &&
         debouncedPage?.pageName != null;
      if (
         validPage &&
         debouncedPage.updateReferences === updateStatus.shouldUpdate &&
         references.status !== thunkStatus.pending
      ) {
         if (fetchRefsForPagePromise != null) {
            fetchRefsForPagePromise.abort();
         }
         const pr = dispatch(
            referenceActions.fetchRefsForPage({
               query: debouncedPage.pageName!,
               pageId: debouncedPage.pageId!,
            })
         );
         setFetchRefsForPagePromise(pr);
      }
   }, [dispatch, debouncedPage, sidebar.status.updateReferences]);

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={WaitingToLoadNotionSite}>
            {calculateSidebarStatus(sidebar.status) !== thunkStatus.pending && (
               <>
                  {references.status !== thunkStatus.rejected && (
                     <>
                        <Backlinks refs={references}></Backlinks>
                        <Mentions marks={marks}></Mentions>
                        <FullTitle refs={references}></FullTitle>
                        <Relations refs={references}></Relations>
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
   const classes = useStyles();

   const backlinks = refs.pageReferences.backlinks;
   const backlinksMemo = useMemo(
      () =>
         backlinks.map((u) => {
            return (
               <Backlink key={u.backlinkBlock.blockId} backlink={u}></Backlink>
            );
         }),
      [backlinks]
   );

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
               {backlinksMemo}
               {backlinks.length === 0 && <NothingToFind />}
            </>
         )}
      </Suspense>
   );
};

const Relations = ({ refs }: { refs: ReferenceState }) => {
   const classes = useStyles();

   const relations = refs.pageReferences.relations;
   const relationsMemo = useMemo(
      () =>
         relations.map((u) => {
            let link: BacklinkRecordModel = {
               backlinkBlock: u,
               path: [u],
            };
            return (
               <Backlink
                  key={u.blockId}
                  backlink={link}
                  showInlineBlock={false}></Backlink>
            );
         }),
      [relations]
   );

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
               {relationsMemo}
               {relations.length === 0 && <NothingToFind />}
            </>
         )}
      </Suspense>
   );
};

const Mentions = ({ marks }: { marks: PageMarkState }) => {
   const classes = useStyles();

   const mentions = marks.pageMarks?.pageMentions ?? [];
   const status = marks.status;
   const mentionsMemo = useMemo(
      () =>
         mentions.map((u) => {
            return <PageMention key={u.blockId} mentionBlock={u}></PageMention>;
         }),
      [mentions]
   );

   return (
      <Suspense fallback={LoadingSection}>
         {status === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Page Mentions</b>
               </Typography>
               {mentionsMemo}
               {mentions.length === 0 && <NothingToFind />}
            </>
         )}
      </Suspense>
   );
};

const FullTitle = ({ refs }: { refs: ReferenceState }) => {
   const classes = useStyles();

   const fullTitle = refs.pageReferences.references.fullTitle;
   const fullTitleMemo = useMemo(
      () =>
         fullTitle.map((u) => {
            return <Reference key={u.id} refData={u}></Reference>;
         }),
      [fullTitle]
   );

   return (
      <Suspense fallback={LoadingSection}>
         {refs.status === thunkStatus.pending && (
            <LoadingSection></LoadingSection>
         )}
         {refs.status === thunkStatus.fulfilled && (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Search Results</b>
               </Typography>
               {fullTitleMemo}
               {fullTitle.length === 0 && <NothingToFind />}
            </>
         )}
      </Suspense>
   );
};

const Related = ({ refs }: { refs: ReferenceState }) => {
   const classes = useStyles();

   const related = refs.pageReferences.references.related;
   const relatedMemo = useMemo(
      () =>
         related.map((u) => {
            return <Reference key={u.id} refData={u}></Reference>;
         }),
      [related]
   );

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
               {relatedMemo}
               {related.length === 0 && <NothingToFind />}
            </>
         )}
      </Suspense>
   );
};
