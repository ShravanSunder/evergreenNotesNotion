import React, { Suspense, useMemo } from 'react';
import { Typography, Divider, useTheme } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypeEnum, inBlockTypes } from 'aNotion/types/notionV3/BlockTypes';
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
import {
   LoadingLine,
   SomethingWentWrong,
} from 'aNotion/components/common/Loading';
import { TextUi } from 'aNotion/components/blocks/TextUi';
import { blockStyles } from './blockStyles';
import { ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { BookmarkUi } from './BookmarkUI';
import { EmbedUi } from './EmbedUI';
import { BlockContextMenu } from '../pageMarks/BlockContextMenu';

interface IBlockUi {
   block: INotionBlockModel;
   index?: number | undefined;
   semanticFilter?: SemanticFormatEnum[];
   style?: React.CSSProperties;
   interactive?: boolean;
   renderPagesAsInline?: boolean;
   disableToggles?: boolean;
   parentPageId?: string;
}

export const BlockUi = ({
   block,
   index,
   semanticFilter,
   style,
   interactive = true,
   renderPagesAsInline = true,
   disableToggles = false,
   parentPageId,
}: IBlockUi) => {
   const classes = blockStyles();
   const variant = useVariant(block);
   const theme = useTheme();

   let backgroundColor = getBackgroundColor(
      block,
      theme.palette.type === 'dark'
   );
   let color = getForegroundColor(block, theme.palette.type === 'dark');
   const useGeneric =
      variant != null &&
      block.type !== BlockTypeEnum.Page &&
      block.type !== BlockTypeEnum.CollectionViewPage;

   const blockStyle: React.CSSProperties = inheritAndCombineStyles(
      style,
      backgroundColor,
      color
   );

   const [anchorEl, setAnchorEl] = React.useState<{
      mouseX: null | number;
      mouseY: null | number;
   }>({
      mouseX: null,
      mouseY: null,
   });

   const contextClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.type === 'contextmenu') {
         event.preventDefault();
         setAnchorEl({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
         });
      } else {
         setAnchorEl({
            mouseX: null,
            mouseY: null,
         });
      }
   };

   const isEmbedBlock =
      block.type === BlockTypeEnum.Audio ||
      block.type === BlockTypeEnum.Video ||
      block.type === BlockTypeEnum.File ||
      block.type === BlockTypeEnum.Embed ||
      !inBlockTypes(block.type);

   const blockMemo = useMemo(
      () => (
         <div
            id="BlockUI"
            className={classes.block}
            style={{ ...blockStyle }}
            onContextMenu={contextClick}
            onClick={contextClick}>
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
                  style={blockStyle}
                  inlineBlock={renderPagesAsInline}
                  showContent={!renderPagesAsInline}
                  interactive={interactive}
                  semanticFilter={semanticFilter}
               />
            )}
            {block.type === BlockTypeEnum.CollectionViewPage && (
               <PageUi
                  block={block}
                  style={blockStyle}
                  inlineBlock={renderPagesAsInline}
                  showContent={!renderPagesAsInline}
                  interactive={interactive}
               />
            )}
            {block.type === BlockTypeEnum.CollectionViewInline && (
               <PageUi
                  block={block}
                  style={blockStyle}
                  inlineBlock={renderPagesAsInline}
                  showContent={!renderPagesAsInline}
                  interactive={interactive}
               />
            )}
            {block.type === BlockTypeEnum.Toggle && (
               <ToggleUi
                  block={block}
                  semanticFilter={semanticFilter}
                  interactive={interactive}
                  style={blockStyle}
                  disableToggles={disableToggles}
               />
            )}
            {block.type === BlockTypeEnum.Code && <CodeUi block={block} />}
            {block.type === BlockTypeEnum.Image && <ImageUi block={block} />}
            {block.type === BlockTypeEnum.Bookmark && (
               <BookmarkUi block={block} semanticFilter={semanticFilter} />
            )}
            {isEmbedBlock && (
               <EmbedUi block={block} semanticFilter={semanticFilter} />
            )}
         </div>
      ),
      [block, blockStyle, renderPagesAsInline, interactive, disableToggles]
   );

   return (
      <ErrorBoundary FallbackComponent={SomethingWentWrong}>
         <Suspense fallback={LoadingLine}>
            {blockMemo}
            <BlockContextMenu
               block={block}
               anchorEl={anchorEl}
               setAnchorEl={setAnchorEl}
               pageId={parentPageId}></BlockContextMenu>
         </Suspense>
      </ErrorBoundary>
   );
};
export default BlockUi;

const useVariant = (block: INotionBlockModel) => {
   let variant: Variant | undefined;
   switch (block.type) {
      case BlockTypeEnum.Text:
      case BlockTypeEnum.Date:
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
