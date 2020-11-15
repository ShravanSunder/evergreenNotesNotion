import React, { Suspense } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { makeStyles, createStyles, Typography } from '@material-ui/core';
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

   let classes = useStyles();

   const nothingFound =
      pageMarks?.code.length === 0 &&
      pageMarks?.comments.length === 0 &&
      pageMarks?.events.length === 0 &&
      pageMarks?.highlights.length === 0 &&
      pageMarks?.links.length === 0 &&
      pageMarks?.userMentions.length === 0 &&
      pageMarks?.quotes.length === 0 &&
      pageMarks?.todos.length === 0;

   //needs refactoring
   let highlights =
      pageMarks?.highlights != null && pageMarks?.highlights.length > 0 ? (
         <>
            <Typography className={classes.sections} variant="h5">
               <b>Highlights</b>
            </Typography>
            {pageMarks?.highlights?.map((p, i) => (
               <NotionContentWithBlocks
                  key={p.blockId}
                  blockContent={p}
                  semanticFilter={[
                     SemanticFormatEnum.Colored,
                  ]}></NotionContentWithBlocks>
            ))}
            <div className={classes.spacing}></div>
         </>
      ) : null;

   let Mentions =
      (pageMarks?.userMentions != null && pageMarks?.userMentions.length > 0) ||
      (pageMarks?.pageMentions != null &&
         pageMarks?.pageMentions.length > 0) ? (
         <>
            <Typography className={classes.sections} variant="h5">
               <b>Mentions</b>
            </Typography>
            {pageMarks?.userMentions?.map((p, i) => (
               <NotionContentWithBlocks
                  key={p.blockId}
                  blockContent={p}></NotionContentWithBlocks>
            ))}
            {pageMarks?.pageMentions?.map((p, i) => (
               <NotionContentWithBlocks
                  key={p.blockId}
                  blockContent={p}></NotionContentWithBlocks>
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
               <NotionContentWithBlocks
                  key={p.blockId}
                  blockContent={p}></NotionContentWithBlocks>
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
               <NotionContentWithBlocks
                  key={p.blockId}
                  blockContent={p}
                  semanticFilter={[
                     SemanticFormatEnum.Link,
                  ]}></NotionContentWithBlocks>
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
               <>
                  <NotionContentWithBlocks
                     key={p.blockId}
                     blockContent={p}
                     semanticFilter={[
                        SemanticFormatEnum.InlineCode,
                     ]}></NotionContentWithBlocks>
               </>
            ))}
            <div className={classes.spacing}></div>
         </>
      ) : null;
   let todos =
      pageMarks?.todos != null && pageMarks?.todos.length > 0 ? (
         <>
            <Typography className={classes.sections} variant="h5">
               <b>Todo</b>
            </Typography>
            {pageMarks?.todos?.map((p, i) => (
               <NotionContentWithBlocks
                  key={p.blockId}
                  blockContent={p}></NotionContentWithBlocks>
            ))}
            <div className={classes.spacing}></div>
         </>
      ) : null;
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {/* {status === thunkStatus.fulfilled && (
               <>
                  <MarkSections
                     name="Highlights"
                     blocks={pageMarks?.highlights}></MarkSections>
               </>
            )} */}
            {status === thunkStatus.fulfilled && highlights}
            {status === thunkStatus.fulfilled && todos}
            {/* {status === thunkStatus.fulfilled && Mentions} */}
            {status === thunkStatus.fulfilled && links}
            {status === thunkStatus.fulfilled && quotes}
            {status === thunkStatus.fulfilled && code}
            {status === thunkStatus.pending && <LoadingSection />}
            {status === thunkStatus.fulfilled && nothingFound && (
               <NothingToFind></NothingToFind>
            )}
         </Suspense>
      </ErrorBoundary>
   );
};

export default MarksPane;
