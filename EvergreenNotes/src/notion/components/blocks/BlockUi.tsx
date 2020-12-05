import React, { Suspense } from 'react';
import { Typography, Divider } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { Variant } from '@material-ui/core/styles/createTypography';
import { PageUi } from './PageUi';
import { BulletUi } from './BulletUi';
import { TodoUi } from './TodoUi';
import { QuoteUi } from './QuoteUi';
import { CalloutUi } from './CalloutUi';
import { CodeUi } from './CodeUi';
import { ToggleUi } from './ToggleUi';
import { NumberUi } from './NumberUi';
import {
   getBackgroundColor,
   getForegroundColor,
   inheritAndCombineStyles,
} from 'aNotion/services/blockService';
import { ImageUi } from './ImageUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { LoadingLine } from 'aNotion/components/common/Loading';
import { TextUi } from 'aNotion/components/blocks/TextUi';
import { useBlockStyles } from './useBlockStyles';

interface IBlockUi {
   block: INotionBlockModel;
   index?: number | undefined;
   semanticFilter?: SemanticFormatEnum[];
   style?: React.CSSProperties;
   interactive?: boolean;
   doNotRenderChildBlocks?: boolean;
}

export const BlockUi = ({
   block,
   index,
   semanticFilter,
   style,
   interactive = true,
   doNotRenderChildBlocks = true,
}: IBlockUi) => {
   let classes = useBlockStyles();
   let variant = useVariant(block);
   let backgroundColor = getBackgroundColor(block);
   let color = getForegroundColor(block);
   const useGeneric =
      variant != null &&
      block.type !== BlockTypeEnum.Page &&
      block.type !== BlockTypeEnum.CollectionViewPage;
   const hasChildren = block.contentIds.length > 0;

   const blockStyle: React.CSSProperties = inheritAndCombineStyles(
      style,
      backgroundColor,
      color
   );

   return (
      <Suspense fallback={LoadingLine}>
         <div id="BlockUI" className={classes.block} style={blockStyle}>
            {useGeneric && (
               <TextUi
                  variant={variant}
                  block={block}
                  semanticFilter={semanticFilter}
                  interactive={interactive}
                  style={blockStyle}></TextUi>
            )}
            {block.type === BlockTypeEnum.Divider && <Divider></Divider>}
            {block.type === BlockTypeEnum.Callout && (
               <CalloutUi block={block} interactive={interactive}></CalloutUi>
            )}
            {block.type === BlockTypeEnum.Quote && (
               <QuoteUi
                  block={block}
                  semanticFilter={semanticFilter}
                  interactive={interactive}
                  style={blockStyle}
               />
            )}
            {block.type === BlockTypeEnum.ButtetedList && (
               <BulletUi
                  block={block}
                  semanticFilter={semanticFilter}
                  style={blockStyle}
                  interactive={interactive}
               />
            )}
            {block.type === BlockTypeEnum.NumberedList && (
               <NumberUi
                  block={block}
                  semanticFilter={semanticFilter}
                  style={blockStyle}
                  interactive={interactive}
               />
            )}
            {block.type === BlockTypeEnum.ToDo && <TodoUi block={block} />}
            {block.type === BlockTypeEnum.Page && (
               <PageUi
                  block={block}
                  style={style}
                  inlineBlock={doNotRenderChildBlocks}
                  showContent={!doNotRenderChildBlocks}
                  interactive={interactive}
               />
            )}
            {block.type === BlockTypeEnum.CollectionViewPage && (
               <PageUi
                  block={block}
                  style={style}
                  inlineBlock={doNotRenderChildBlocks}
                  showContent={!doNotRenderChildBlocks}
                  interactive={interactive}
               />
            )}
            {block.type === BlockTypeEnum.CollectionViewInline && (
               <PageUi
                  block={block}
                  style={style}
                  inlineBlock={doNotRenderChildBlocks}
                  showContent={!doNotRenderChildBlocks}
                  interactive={interactive}
               />
            )}
            {block.type === BlockTypeEnum.Toggle && (
               <ToggleUi
                  block={block}
                  semanticFilter={semanticFilter}
                  interactive={interactive}
                  style={blockStyle}
                  doNotRenderChildBlocks={doNotRenderChildBlocks}
               />
            )}
            {block.type === BlockTypeEnum.Code && <CodeUi block={block} />}
            {block.type === BlockTypeEnum.Image && <ImageUi block={block} />}
         </div>
      </Suspense>
   );
};
export default BlockUi;

const useVariant = (block: INotionBlockModel) => {
   let variant: Variant | undefined;
   switch (block.type) {
      case BlockTypeEnum.Text:
      case BlockTypeEnum.Date:
      case BlockTypeEnum.Bookmark:
      case BlockTypeEnum.Page:
         variant = 'body1';
         break;
      case BlockTypeEnum.Header1:
      case BlockTypeEnum.CollectionViewPage:
         variant = 'h4';
         break;
      case BlockTypeEnum.Header2:
         variant = 'h5';
         break;
      case BlockTypeEnum.Header3:
         variant = 'h6';
         break;
   }
   return variant;
};
