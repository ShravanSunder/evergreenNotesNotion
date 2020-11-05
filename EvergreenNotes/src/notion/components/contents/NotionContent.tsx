import React, { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/appDispatch';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { contentActions } from 'aNotion/components/contents/contentSlice';
import { LoadingSection, LoadingLine } from '../common/Loading';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { Grid, Typography } from '@material-ui/core';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

const BlockUi = React.lazy(() => import('../blocks/BlockUi'));

export const NotionContent = ({
   blockId,
   contentIds,
   depth,
   semanticFilter,
   style,
}: {
   blockId: string;
   contentIds?: string[];
   depth?: number;
   semanticFilter?: SemanticFormatEnum[];
   style?: React.CSSProperties;
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
                        <BlockUi
                           block={p}
                           index={i}
                           semanticFilter={semanticFilter}
                           style={style}></BlockUi>
                        <Children
                           block={p}
                           depth={depth ?? 1}
                           semanticFilter={semanticFilter}
                           style={style}></Children>
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
   semanticFilter,
   style,
}: {
   block: NotionBlockModel;
   depth: number;
   semanticFilter?: SemanticFormatEnum[];
   style?: React.CSSProperties;
}) => {
   if (depth > 6) {
      return null;
   }

   switch (block.type) {
      case BlockTypeEnum.Page:
      case BlockTypeEnum.CollectionViewInline:
      case BlockTypeEnum.CollectionViewPage:
      case BlockTypeEnum.TemplateButton:
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
               semanticFilter={semanticFilter}
               style={style}
               depth={depth + 1}></NotionContent>
         </Grid>
      </Grid>
   );
};
