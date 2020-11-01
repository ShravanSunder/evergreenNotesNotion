import React, { Suspense } from 'react';
import {
   Typography,
   Divider,
   makeStyles,
   createStyles,
   Theme,
} from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { Variant } from '@material-ui/core/styles/createTypography';
import { grey } from '@material-ui/core/colors';
import { PageUi } from './PageUi';
import { BulletUi } from './BulletUi';
import { TodoUi } from './TodoUi';
import { QuoteUi } from './QuoteUi';
import { CalloutUi } from './CalloutUi';
import { CodeUi } from './CodeUi';
import { ToggleUi } from './ToggleUi';
import { NumberUi } from './NumberUi';
import { NotionColor } from 'aNotion/types/notionV3/notionBaseTypes';
import { shallowEqual } from 'react-redux';
import { navigationSelector } from 'aNotion/providers/storeSelectors';
import {
   getBackgroundColor,
   getForegroundColor,
} from 'aNotion/services/blockService';
import { TextUi } from './TextUi';
import { ImageUi } from './ImageUi';
import { LoadingImage, LoadingLine } from '../common/Loading';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

export const useBlockStyles = makeStyles((theme: Theme) =>
   createStyles({
      block: {
         margin: 2,
         padding: 1,
      },
      typography: {
         overflowWrap: 'break-word',
         wordBreak: 'break-word',
         position: 'relative',
      },
      indentColumnBlock: {
         paddingLeft: 12,
         paddingRight: 3,
         marginTop: 1,
      },
      inlineIcon: {
         position: 'relative',
         top: 3,
      },
      link: {
         overflowWrap: 'anywhere',
         wordBreak: 'break-all',
         color: grey[600],
      },
   })
);

export const BlockUi = ({
   block,
   index,
   semanticFilter,
}: {
   block: NotionBlockModel;
   index: number | undefined;
   semanticFilter?: SemanticFormatEnum[];
}) => {
   let classes = useBlockStyles();
   let variant = useVariant(block);
   let backgroundColor = getBackgroundColor(block);
   let color = getForegroundColor(block);
   let useGeneric =
      variant != null &&
      block.type !== BlockTypeEnum.Page &&
      block.type !== BlockTypeEnum.CollectionViewPage;

   return (
      <Suspense fallback={LoadingLine}>
         <div
            className={classes.block}
            style={{ backgroundColor: backgroundColor, color: color }}>
            {useGeneric && (
               <TextUi
                  variant={variant}
                  block={block}
                  semanticFilter={semanticFilter}
                  style={{
                     backgroundColor: backgroundColor,
                     color: color,
                  }}></TextUi>
            )}
            {block.type === BlockTypeEnum.Divider && <Divider></Divider>}
            {block.type === BlockTypeEnum.Callout && (
               <CalloutUi block={block}></CalloutUi>
            )}
            {block.type === BlockTypeEnum.Quote && (
               <QuoteUi block={block} semanticFilter={semanticFilter} />
            )}
            {block.type === BlockTypeEnum.ButtetedList && (
               <BulletUi block={block} semanticFilter={semanticFilter} />
            )}
            {block.type === BlockTypeEnum.NumberedList && (
               <NumberUi block={block} semanticFilter={semanticFilter} />
            )}
            {block.type === BlockTypeEnum.ToDo && <TodoUi block={block} />}
            {block.type === BlockTypeEnum.Page && (
               <PageUi block={block} variant={variant} />
            )}
            {block.type === BlockTypeEnum.CollectionViewPage && (
               <PageUi block={block} variant={variant} />
            )}
            {block.type === BlockTypeEnum.Toggle && <ToggleUi block={block} />}
            {block.type === BlockTypeEnum.Code && <CodeUi block={block} />}
            {block.type === BlockTypeEnum.Image && <ImageUi block={block} />}
         </div>
      </Suspense>
   );
};
export default BlockUi;

const useVariant = (block: NotionBlockModel) => {
   let variant: Variant | undefined;
   switch (block.type) {
      case BlockTypeEnum.Text:
      case BlockTypeEnum.Date:
      case BlockTypeEnum.Bookmark:
         variant = 'body1';
         break;
      case BlockTypeEnum.Header1:
      case BlockTypeEnum.CollectionViewPage:
      case BlockTypeEnum.Page:
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
