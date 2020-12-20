import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { ErrorBoundary, ErrorFallback } from 'aCommon/Components/ErrorFallback';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import {
   currentPageSelector,
   pageMarksSelector,
} from 'aNotion/providers/storeSelectors';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { BlockUi } from '../blocks/BlockUi';
import { PageUi } from '../blocks/PageUi';
import { LoadingSection, NothingToFind } from '../common/Loading';
import { handleNavigateToBlockInNotion } from './NavigateToBlockInNotion';

const useStyles = makeStyles(() =>
   createStyles({
      spacing: {
         marginBottom: 36,
      },
      toc: {
         cursor: 'pointer',
      },
   })
);

type TIndentType = {
   level: number;
   type: BlockTypeEnum;
};

type TLimitedIndentTree = {
   [key: string]: 'Level1' | 'Level2' | 'Level3';
};

/**
 * Table of Contents Pane
 */
export const TocPane = () => {
   const { pageMarks, status } = useSelector(pageMarksSelector, shallowEqual);
   const { currentPageData } = useSelector(currentPageSelector, shallowEqual);

   const [tree, setTree] = useState<TLimitedIndentTree>(createLimitedTree());

   const classes = useStyles();
   const headers: INotionBlockModel[] = pageMarks?.headers ?? [];
   const pageBlock: INotionBlockModel | undefined = currentPageData?.pageBlock;
   const nothingFound = headers.length === 0;

   const hasH1 = headers.some((f) => f.type === BlockTypeEnum.Header1);
   const hasH2 = headers.some((f) => f.type === BlockTypeEnum.Header2);

   useEffect(() => {
      if (status === thunkStatus.fulfilled) {
         const tempTree = createLimitedTree(headers, pageBlock?.blockId);
         setTree(tempTree);
      } else if (Object.keys(tree).length > 0) {
         setTree({});
      }
   }, [headers, status, pageBlock?.blockId]);

   const previousHeaderIndent: TIndentType = {
      level: 0,
      type: BlockTypeEnum.Header1,
   };

   const headersMemo = useHeadersMemo(
      headers,
      tree,
      previousHeaderIndent,
      hasH1,
      hasH2
   );

   const toc = (
      <Grid container>
         {headers.length > 0 &&
            currentPageData?.pageBlock != null &&
            currentPageData?.pageBlock.blockId != null && (
               <>
                  <Grid item xs={12}>
                     <strong>
                        <PageUi
                           block={currentPageData?.pageBlock}
                           inlineBlock={false}
                           interactive={false}
                           showContent={false}></PageUi>
                     </strong>
                  </Grid>
                  <Grid item xs={12} className={classes.spacing}></Grid>
               </>
            )}
         {headersMemo}
      </Grid>
   );

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && toc}
            {status === thunkStatus.fulfilled && headers.length === 0 && (
               <NothingToFind></NothingToFind>
            )}
            {status === thunkStatus.pending && <LoadingSection />}
         </Suspense>
      </ErrorBoundary>
   );
};

export default TocPane;

const createLimitedTree = (
   headers?: INotionBlockModel[],
   pageBlockId?: string | undefined
) => {
   if (headers != null && headers.length > 0 && pageBlockId != null) {
      //get the tree
      let tempTree: TLimitedIndentTree = {};
      headers.forEach((f) => {
         if (f.block!.parent_id === pageBlockId) {
            tempTree[f.blockId] = 'Level1';
         } else if (tempTree[f.block!.parent_id] != null) {
            tempTree[f.blockId] = 'Level3';
         } else {
            tempTree[f.blockId] = 'Level2';
         }
      });

      return tempTree;
   }

   return {};
};

const calculateIndent = (
   indent: number,
   currentBlock: INotionBlockModel,
   tree: TLimitedIndentTree
) => {
   let offset = getOffset(tree, currentBlock.blockId);

   if (
      currentBlock.block?.parent_id != null &&
      tree[currentBlock.block?.parent_id] != null
   ) {
      offset += getOffset(tree, currentBlock.block!.parent_id!) + 1;
   }

   return indent + offset;
};

const getOffset = (tree: TLimitedIndentTree, blockId: string) => {
   let offset = 0;
   if (tree[blockId] != null) {
      if (tree[blockId] == 'Level1') offset = 0;
      else if (tree[blockId] == 'Level2') offset = 1;
      else if (tree[blockId] == 'Level3') offset = 2;
   }
   return offset;
};

const TocItems = ({
   h,
   cIndent,
}: {
   h: INotionBlockModel;
   cIndent: number;
}) => {
   let classes = useStyles();

   return (
      <React.Fragment key={h.blockId}>
         {cIndent > 0 && <Grid item xs={cIndent as any} />}
         <Grid
            item
            xs={(12 - cIndent) as any}
            key={h.blockId}
            className={classes.toc}
            onClick={() => handleNavigateToBlockInNotion(h.blockId)}>
            <BlockUi
               block={h}
               index={0}
               interactive={false}
               renderPagesAsInline={true}
               disableToggles={true}></BlockUi>
         </Grid>
      </React.Fragment>
   );
};

const setPreviousHeaderIndent = (
   previousHeaderIndent: TIndentType,
   indent: number,
   h: INotionBlockModel
) => {
   previousHeaderIndent.level = indent;
   previousHeaderIndent.type = h.type;
};

const useHeadersMemo = (
   headers: INotionBlockModel[],
   tree: TLimitedIndentTree,
   previousHeaderIndent: TIndentType,
   hasH1: boolean,
   hasH2: boolean
) => {
   return useMemo(
      () =>
         headers.map((h, i) => {
            if (h.type === BlockTypeEnum.Header1) {
               const indent: number = 0;
               const cIndent = calculateIndent(indent, h, tree);

               return <TocItems key={i} h={h} cIndent={cIndent} />;
            } else if (h.type === BlockTypeEnum.Header2) {
               const indent: number = hasH1 ? 1 : 0;

               setPreviousHeaderIndent(previousHeaderIndent, indent, h);
               const cIndent = calculateIndent(indent, h, tree);

               return <TocItems key={i} h={h} cIndent={cIndent} />;
            } else if (h.type === BlockTypeEnum.Header3) {
               let indent = 0;
               if (hasH1 && hasH2) {
                  indent = 2;
               } else if (hasH1 || hasH2) {
                  indent = 1;
               }

               setPreviousHeaderIndent(previousHeaderIndent, indent, h);
               const cIndent = calculateIndent(indent, h, tree);

               return <TocItems key={i} h={h} cIndent={cIndent} />;
            } else if (h.type === BlockTypeEnum.Toggle) {
               let indent = previousHeaderIndent.level;

               setPreviousHeaderIndent(previousHeaderIndent, indent, h);
               const cIndent = calculateIndent(indent, h, tree);

               return <TocItems key={i} h={h} cIndent={cIndent} />;
            }
            return null;
         }),
      [headers, previousHeaderIndent, tree, hasH1, hasH2]
   );
};
