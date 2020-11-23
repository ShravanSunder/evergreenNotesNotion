import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { ErrorBoundary, ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import {
   currentPageSelector,
   pageMarksSelector,
} from 'aNotion/providers/storeSelectors';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import React, { Suspense } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { BlockUi } from '../blocks/BlockUi';
import { PageUi } from '../blocks/PageUi';
import { LoadingSection, NothingToFind } from '../common/Loading';
import { handleNavigateToBlockInNotion } from './NavigateToBlockInNotion';

const useStyles = makeStyles(() =>
   createStyles({
      spacing: {
         marginBottom: 18,
      },
      toc: {
         cursor: 'pointer',
      },
   })
);

/**
 * Table of Contents Pane
 */
export const TocPane = () => {
   const { pageMarks, status } = useSelector(pageMarksSelector, shallowEqual);
   const { currentPageData } = useSelector(currentPageSelector, shallowEqual);

   let classes = useStyles();
   const headers: INotionBlockModel[] = pageMarks?.headers ?? [];
   const nothingFound = headers.length === 0;

   const hasH1 = headers.some((f) => f.type === BlockTypeEnum.Header1);
   const hasH2 = headers.some((f) => f.type === BlockTypeEnum.Header2);

   const toc = (
      <Grid container>
         {headers.length > 0 &&
            currentPageData?.pageBlock != null &&
            currentPageData?.pageBlock.blockId != null && (
               <>
                  <Grid item xs={12}>
                     <PageUi
                        block={currentPageData?.pageBlock}
                        inlineBlock={false}
                        interactive={false}
                        showContent={false}></PageUi>
                  </Grid>
                  <Grid item xs={12} className={classes.spacing}></Grid>
               </>
            )}
         {headers.map((h, i) => {
            if (h.type === BlockTypeEnum.Header1) {
               return (
                  <React.Fragment key={h.blockId}>
                     <Grid
                        item
                        xs={12}
                        key={h.blockId}
                        className={classes.toc}
                        onClick={() =>
                           handleNavigateToBlockInNotion(h.blockId)
                        }>
                        <BlockUi
                           block={h}
                           index={0}
                           interactive={false}
                           renderPagesAsInline={true}></BlockUi>
                     </Grid>
                  </React.Fragment>
               );
            } else if (h.type === BlockTypeEnum.Header2) {
               const indent: number = hasH1 ? 1 : 0;
               return (
                  <React.Fragment key={h.blockId}>
                     {indent == 1 && <Grid item xs={1} />}
                     <Grid
                        item
                        xs={(12 - indent) as any}
                        key={h.blockId}
                        className={classes.toc}
                        onClick={() =>
                           handleNavigateToBlockInNotion(h.blockId)
                        }>
                        <BlockUi
                           block={h}
                           index={0}
                           interactive={false}
                           renderPagesAsInline={true}></BlockUi>
                     </Grid>
                  </React.Fragment>
               );
            } else if (h.type === BlockTypeEnum.Header3) {
               let indent = 0;
               if (hasH1 && hasH2) {
                  indent = 2;
               } else if (hasH1 || hasH2) {
                  indent = 1;
               }

               return (
                  <React.Fragment key={h.blockId}>
                     {indent > 0 && <Grid item xs={indent as any} />}
                     <Grid
                        item
                        xs={(12 - indent) as any}
                        key={h.blockId}
                        className={classes.toc}
                        onClick={() =>
                           handleNavigateToBlockInNotion(h.blockId)
                        }>
                        <BlockUi
                           block={h}
                           index={0}
                           interactive={false}
                           renderPagesAsInline={true}></BlockUi>
                     </Grid>
                  </React.Fragment>
               );
            }
            return null;
         })}
      </Grid>
   );

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && toc}
            {status === thunkStatus.fulfilled && headers.length === 0 && (
               <NothingToFind></NothingToFind>
            )}
         </Suspense>
      </ErrorBoundary>
   );
};

export default TocPane;
