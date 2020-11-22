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
         marginBottom: 42,
      },
      toc: {
         cursor: 'pointer',
      },
   })
);

// comment
export const TableOfContentsPane = () => {
   const { pageMarks, status } = useSelector(pageMarksSelector, shallowEqual);
   const { currentPageData } = useSelector(currentPageSelector, shallowEqual);

   let classes = useStyles();
   const headers: INotionBlockModel[] = pageMarks?.headers ?? [];
   const nothingFound = headers.length === 0;

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
                        showContent={false}></PageUi>
                  </Grid>
                  <Grid item xs={12} className={classes.spacing}></Grid>
               </>
            )}
         {headers.map((h, i) => {
            if (h.type === BlockTypeEnum.Header1) {
               return (
                  <>
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
                           renderPagesAsInline={true}></BlockUi>
                     </Grid>
                  </>
               );
            } else if (h.type === BlockTypeEnum.Header2) {
               return (
                  <>
                     <Grid item xs={1} />
                     <Grid
                        item
                        xs={11}
                        key={h.blockId}
                        className={classes.toc}
                        onClick={() =>
                           handleNavigateToBlockInNotion(h.blockId)
                        }>
                        <BlockUi
                           block={h}
                           index={0}
                           renderPagesAsInline={true}></BlockUi>
                     </Grid>
                  </>
               );
            } else if (h.type === BlockTypeEnum.Header3) {
               return (
                  <>
                     <Grid item xs={2} />
                     <Grid
                        item
                        xs={10}
                        key={h.blockId}
                        className={classes.toc}
                        onClick={() =>
                           handleNavigateToBlockInNotion(h.blockId)
                        }>
                        <BlockUi
                           block={h}
                           index={0}
                           renderPagesAsInline={true}></BlockUi>
                     </Grid>
                  </>
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

export default TableOfContentsPane;
