import React, { useEffect, Suspense, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { TAppDispatchWithPromise } from 'aNotion/providers/appDispatch';
import { contentSelector } from 'aNotion/providers/rootSelectors';
import { contentActions } from 'aNotion/components/contents/contentSlice';
import { LoadingSection, LoadingLine } from '../common/Loading';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { Grid, Typography } from '@material-ui/core';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { blockStyles } from 'aNotion/components/blocks/blockStyles';

const BlockUi = React.lazy(() => import('../blocks/BlockUi'));

interface INotionContentParams {
   depth?: number;
   maxDepth?: number;
   semanticFilter?: SemanticFormatEnum[];
   style?: React.CSSProperties;
   renderPagesAsInline?: boolean;
   interactive?: boolean;
   parentPageId?: string;
}

interface INotionContentWithParentIdParams extends INotionContentParams {
   parentBlockId?: string;
}

interface INotionContentWithBlocksParams extends INotionContentParams {
   blockContent?: INotionBlockModel;
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
   style = undefined,
   renderPagesAsInline = true,
   interactive = true,
   parentPageId,
}: INotionContentParams &
   INotionContentWithParentIdParams &
   INotionContentWithBlocksParams) => {
   const contentDataFromState = useSelector(contentSelector);
   let status = thunkStatus.idle;
   const dispatch: TAppDispatchWithPromise<any> = useDispatch();

   let content: INotionBlockModel[] = [];
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
            status == null ||
            status !== thunkStatus.fulfilled) &&
         parentBlockId != null
      ) {
         const promise = dispatch(
            contentActions.fetchContent({
               blockId: parentBlockId,
               forceUpdate: false,
            })
         );
      }
      return () => {};
   }, [parentBlockId, status, content, dispatch]);

   const contentMemo = useContentMemo(
      content,
      interactive,
      semanticFilter,
      style,
      renderPagesAsInline,
      depth,
      maxDepth,
      parentPageId
   );

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && <>{contentMemo}</>}
            {status === thunkStatus.pending && <LoadingSection />}
         </Suspense>
      </ErrorBoundary>
   );
};

interface IContentChildren {
   block: INotionBlockModel;
   depth: number;
   semanticFilter?: SemanticFormatEnum[];
   style?: React.CSSProperties;
   interactive?: boolean;
   parentPageId?: string;
}

const ContentChildren = ({
   block,
   depth,
   semanticFilter,
   style,
   interactive,
   parentPageId,
}: IContentChildren) => {
   let classes = blockStyles();

   switch (block.type) {
      case BlockTypeEnum.Page:
      case BlockTypeEnum.CollectionViewInline:
      case BlockTypeEnum.CollectionViewPage:
      case BlockTypeEnum.TemplateButton:
         return null;
   }

   if (block.contentIds.length === 0 || block.type === BlockTypeEnum.Toggle) {
      return null;
   }

   return (
      <Grid id="NotionContentChild" container justify="flex-start">
         {block.type !== BlockTypeEnum.Column && (
            <Grid item className={classes.blockUiGrids}>
               <div className={classes.bulletsAndIndents}>
                  <Typography display={'inline'} variant={'body1'}>
                     {'   '}
                  </Typography>
               </div>
            </Grid>
         )}
         <Grid item xs className={classes.blockUiGrids}>
            <NotionContent
               parentPageId={parentPageId}
               parentBlockId={block.blockId}
               semanticFilter={semanticFilter}
               style={style}
               depth={depth + 1}
               interactive={interactive}></NotionContent>
         </Grid>
      </Grid>
   );
};

const useContentMemo = (
   content: INotionBlockModel[],
   interactive: boolean,
   semanticFilter: SemanticFormatEnum[] | undefined,
   style: React.CSSProperties | undefined,
   renderPagesAsInline: boolean,
   depth: number | undefined,
   maxDepth: number | undefined,
   parentPageId: string | undefined
) => {
   return useMemo(
      () =>
         (content ?? []).map((p, i) => (
            <React.Fragment key={p.blockId}>
               <BlockUi
                  interactive={interactive}
                  block={p}
                  index={i}
                  semanticFilter={semanticFilter}
                  style={style}
                  renderPagesAsInline={renderPagesAsInline}
                  parentPageId={parentPageId}></BlockUi>
               {(depth ?? 1) < (maxDepth ?? 6) && (
                  <ContentChildren
                     block={p}
                     depth={depth ?? 1}
                     semanticFilter={semanticFilter}
                     interactive={interactive}
                     style={style}></ContentChildren>
               )}
            </React.Fragment>
         )),
      [
         content,
         interactive,
         semanticFilter,
         style,
         renderPagesAsInline,
         depth,
         parentPageId,
      ]
   );
};
