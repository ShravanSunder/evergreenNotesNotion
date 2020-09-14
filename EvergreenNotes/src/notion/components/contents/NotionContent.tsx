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

export const NotionContent = ({
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
      if (
         content == null ||
         status === thunkStatus.rejected ||
         status === thunkStatus.idle
      ) {
         const promise = dispatch(contentActions.fetchContent({ blockId }));
         return () => {
            promise.abort();
         };
      }
      return () => {};
   }, []);

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && (
               <>
                  {content.map((p, i) => (
                     <React.Fragment key={p.blockId}>
                        <BlockUi block={p} index={i}></BlockUi>
                        <Children block={p} depth={depth ?? 1}></Children>
                     </React.Fragment>
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
      <Grid container alignItems="flex-start">
         {block.type !== BlockTypeEnum.Column && (
            <Grid item style={{ width: 21 }}></Grid>
         )}
         <Grid item xs>
            <NotionContent
               blockId={block.blockId}
               contentIds={block.contentIds}
               depth={depth + 1}></NotionContent>
         </Grid>
      </Grid>
   );
};
