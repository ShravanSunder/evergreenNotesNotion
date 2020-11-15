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
import { useBlockStyles } from '../blocks/useBlockStyles';

const BlockUi = React.lazy(() => import('../blocks/BlockUi'));

interface INotionContentParams {
   depth?: number;
   maxDepth?: number;
   semanticFilter?: SemanticFormatEnum[];
   style?: React.CSSProperties;
}

interface INotionContentWithParentIdParams extends INotionContentParams {
   parentBlockId?: string;
}

interface INotionContentWithBlocksParams extends INotionContentParams {
   blockContent?: NotionBlockModel;
}

export const NotionContentWithParentId = (
   props: INotionContentWithParentIdParams
) => {
   return NotionContent(props);
};

export const NotionContentWithBlocks = (
   props: INotionContentWithBlocksParams
) => {
   return NotionContent(props);
};

const NotionContent = ({
   parentBlockId,
   blockContent,
   depth,
   maxDepth,
   semanticFilter,
   style,
}: INotionContentParams &
   INotionContentWithParentIdParams &
   INotionContentWithBlocksParams) => {
   const contentDataFromState = useSelector(contentSelector);
   let status = thunkStatus.idle;
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   let content: NotionBlockModel[];
   if (blockContent == null && parentBlockId != null) {
      content = contentDataFromState?.[parentBlockId]?.content;
      status = contentDataFromState?.[parentBlockId]?.status;
   } else if (blockContent != null && parentBlockId == null) {
      content = [blockContent]!;
      status = thunkStatus.fulfilled;
   } else {
      content = [];
      console.error(
         'NotionContent: Both parentBlockId and blockContent cannot be null and only one should contain values'
      );
   }

   useEffect(() => {
      if (
         (content == null ||
            status === thunkStatus.rejected ||
            status === thunkStatus.idle) &&
         parentBlockId != null
      ) {
         const promise = dispatch(
            contentActions.fetchContent({ blockId: parentBlockId })
         );
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
                        {(depth ?? 1) < (maxDepth ?? 6) && (
                           <Children
                              block={p}
                              depth={depth ?? 1}
                              semanticFilter={semanticFilter}
                              style={style}></Children>
                        )}
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
   let classes = useBlockStyles();

   switch (block.type) {
      case BlockTypeEnum.Page:
      case BlockTypeEnum.CollectionViewInline:
      case BlockTypeEnum.CollectionViewPage:
      case BlockTypeEnum.TemplateButton:
         return null;
   }

   return (
      <Grid container justify="flex-start">
         {block.type !== BlockTypeEnum.Column && (
            <Grid item xs={1} className={classes.blockUiGrids} />
         )}
         <Grid item xs={11} className={classes.blockUiGrids}>
            <NotionContent
               parentBlockId={block.blockId}
               semanticFilter={semanticFilter}
               style={style}
               depth={depth + 1}></NotionContent>
         </Grid>
      </Grid>
   );
};
