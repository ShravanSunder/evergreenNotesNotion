import React, { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { contentActions } from 'aNotion/components/contents/contentSlice';
import { LoadingSection } from '../common/Loading';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { Grid, Typography } from '@material-ui/core';

const BlockUi = React.lazy(() => import('../blocks/BlockUi'));

export const BlockContent = ({
   blockId,
   contentIds,
   depth,
}: {
   blockId: string;
   contentIds?: string[];
   depth?: number;
}) => {
   const contentData = useSelector(contentSelector);
   const content = contentData?.[blockId]?.content;
   const status = contentData?.[blockId]?.status;
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   useEffect(() => {
      dispatch(
         contentActions.fetchContent({ blockId, contentIds: contentIds ?? [] })
      );
   }, [blockId, contentIds, dispatch]);

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && (
               <>
                  {content.map((p, i) => (
                     <>
                        <BlockUi key={p.blockId} block={p} index={i}></BlockUi>
                        <Children
                           key={'children' + p.blockId}
                           block={p}
                           depth={depth ?? 1}></Children>
                     </>
                  ))}
               </>
            )}
            {status === thunkStatus.pending && <LoadingSection />}
         </Suspense>
      </ErrorBoundary>
   );
};

const Children = ({
   block,
   depth,
}: {
   block: NotionBlockModel;
   depth: number;
}) => {
   if (depth > 4) {
      return null;
   }

   switch (block.type) {
      case BlockTypeEnum.Page:
      case BlockTypeEnum.CollectionViewInline:
      case BlockTypeEnum.CollectionViewPage:
         return null;
   }

   return (
      <>
         <Grid container alignItems="flex-start">
            <Grid item xs={1}></Grid>
            <Grid item xs={11}>
               <BlockContent
                  blockId={block.blockId}
                  contentIds={block.contentIds}></BlockContent>
            </Grid>
         </Grid>
      </>
   );
};
