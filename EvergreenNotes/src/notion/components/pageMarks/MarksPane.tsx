import React, { Suspense, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import {
   makeStyles,
   createStyles,
   Typography,
   Grid,
   useTheme,
} from '@material-ui/core';
import { pageMarksSelector } from 'aNotion/providers/storeSelectors';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { LoadingSection, NothingToFind } from '../common/Loading';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import {
   NotionContentWithBlocks,
   NotionContentWithParentId,
} from 'aNotion/components/contents/NotionContent';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { NavigateToBlockInNotion } from './NavigateToBlockInNotion';

const useStyles = makeStyles(() =>
   createStyles({
      sections: {
         marginLeft: 6,
         marginTop: 36,
         marginBottom: 12,
         fontVariant: 'small-caps',
      },
      spacing: {
         marginBottom: 42,
      },
   })
);

// comment
export const MarksPane = () => {
   const { pageMarks, status } = useSelector(pageMarksSelector, shallowEqual);
   const classes = useStyles();
   const nothingFound =
      pageMarks?.code.length === 0 &&
      pageMarks?.comments.length === 0 &&
      pageMarks?.events.length === 0 &&
      pageMarks?.highlights.length === 0 &&
      pageMarks?.links.length === 0 &&
      pageMarks?.userMentions.length === 0 &&
      pageMarks?.quotes.length === 0 &&
      pageMarks?.todos.length === 0;

   const highlights = useMemo(
      () =>
         pageMarks?.highlights != null && pageMarks?.highlights.length > 0 ? (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Highlights</b>
               </Typography>
               {pageMarks?.highlights?.map((p, i) => (
                  <RenderMark
                     key={p.blockId}
                     p={p}
                     semanticFilters={[
                        SemanticFormatEnum.Colored,
                     ]}></RenderMark>
               ))}
               <div className={classes.spacing}></div>
            </>
         ) : null,
      [pageMarks?.highlights]
   );

   const mentions = useMemo(
      () =>
         (pageMarks?.userMentions != null &&
            pageMarks?.userMentions.length > 0) ||
         (pageMarks?.userMentions != null &&
            pageMarks?.userMentions.length > 0) ? (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Mentions</b>
               </Typography>
               {pageMarks?.userMentions?.map((p, i) => (
                  <RenderMark
                     key={p.blockId}
                     p={p}
                     semanticFilters={[]}></RenderMark>
               ))}
               <div className={classes.spacing}></div>
            </>
         ) : null,
      [pageMarks?.userMentions]
   );

   const quotes = useMemo(
      () =>
         pageMarks?.quotes != null && pageMarks?.quotes.length > 0 ? (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Quotes</b>
               </Typography>
               {pageMarks?.quotes?.map((p, i) => (
                  <RenderMark
                     key={p.blockId}
                     p={p}
                     semanticFilters={[]}></RenderMark>
               ))}
               <div className={classes.spacing}></div>
            </>
         ) : null,
      [pageMarks?.quotes]
   );

   const links = useMemo(
      () =>
         pageMarks?.links != null && pageMarks?.links.length > 0 ? (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Links</b>
               </Typography>
               {pageMarks?.links?.map((p, i) => (
                  <RenderMark
                     key={p.blockId}
                     p={p}
                     semanticFilters={[SemanticFormatEnum.Link]}></RenderMark>
               ))}
               <div className={classes.spacing}></div>
            </>
         ) : null,
      [pageMarks?.links]
   );

   const code = useMemo(
      () =>
         pageMarks?.code != null && pageMarks?.code.length > 0 ? (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Code</b>
               </Typography>
               {pageMarks?.code?.map((p, i) => (
                  <RenderMark
                     key={p.blockId}
                     p={p}
                     semanticFilters={[
                        SemanticFormatEnum.InlineCode,
                     ]}></RenderMark>
               ))}
               <div className={classes.spacing}></div>
            </>
         ) : null,
      [pageMarks?.code]
   );

   const todos = useMemo(
      () =>
         pageMarks?.todos != null && pageMarks?.todos.length > 0 ? (
            <>
               <Typography className={classes.sections} variant="h5">
                  <b>Todo</b>
               </Typography>
               {pageMarks?.todos?.map((p, i) => (
                  <RenderMark
                     key={p.blockId}
                     p={p}
                     semanticFilters={[
                        SemanticFormatEnum.Colored,
                     ]}></RenderMark>
               ))}
               <div className={classes.spacing}></div>
            </>
         ) : null,
      [pageMarks?.todos]
   );

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && highlights}
            {status === thunkStatus.fulfilled && todos}
            {status === thunkStatus.fulfilled && quotes}
            {status === thunkStatus.fulfilled && code}
            {status === thunkStatus.fulfilled && links}
            {status === thunkStatus.pending && <LoadingSection />}
            {status === thunkStatus.fulfilled && nothingFound && (
               <NothingToFind></NothingToFind>
            )}
         </Suspense>
      </ErrorBoundary>
   );
};

export default MarksPane;

const RenderMark = ({
   p,
   semanticFilters,
}: {
   p: INotionBlockModel;
   semanticFilters: SemanticFormatEnum[];
}) => {
   const theme = useTheme();

   return (
      <Grid container>
         <Grid item xs>
            <NotionContentWithBlocks
               key={p.blockId}
               blockContent={p}
               semanticFilter={semanticFilters}></NotionContentWithBlocks>
         </Grid>
         <Grid item>
            <div style={{ marginTop: theme.spacing(1) }}></div>
            <NavigateToBlockInNotion block={p}></NavigateToBlockInNotion>
         </Grid>
      </Grid>
   );
};
