import React, { useMemo } from 'react';
import { Typography, Icon } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { Page } from 'aNotion/types/notionV3/notionBlockTypes';
import { TextUi } from './TextUi';
import { Variant } from '@material-ui/core/styles/createTypography';
import { NotionContentWithParentId } from 'aNotion/components/contents/NotionContent';
import { MaximizeTwoTone } from '@material-ui/icons';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

interface IPageUIParams {
   block: INotionBlockModel;
   style?: React.CSSProperties | undefined;
   inlineBlock?: boolean;
   showContent?: boolean;
   interactive?: boolean;
   semanticFilter?: SemanticFormatEnum[];
}

export const PageUi = ({
   block,
   style = undefined,
   inlineBlock = true,
   showContent = false,
   interactive = true,
   semanticFilter = undefined,
}: IPageUIParams) => {
   const page = block.block as Page;
   let icon = page.format?.page_icon;
   const variant = inlineBlock ? 'body1' : 'h4';

   const renderChildren = inlineBlock ? false : showContent;

   const iconComponent: JSX.Element | undefined = useMemo(
      () => getIcon(icon, variant, block),
      [icon, variant, block]
   );

   let untitled = false;
   if (block.semanticTitle == null || block.semanticTitle.length === 0) {
      untitled = true;
   }

   return (
      <div id="PageUI" style={style}>
         {iconComponent}
         {!untitled && (
            <TextUi
               block={block}
               variant={variant}
               interactive={interactive}
               style={style}></TextUi>
         )}
         {untitled && (
            <Typography variant={variant} display="inline">
               Untitled
            </Typography>
         )}
         {renderChildren && (
            <>
               <div style={{ marginTop: 12 }}></div>
               <NotionContentWithParentId
                  interactive={interactive}
                  semanticFilter={semanticFilter}
                  parentBlockId={block.blockId}></NotionContentWithParentId>
            </>
         )}
      </div>
   );
};

function getIcon(
   icon: string | undefined,
   variant: Variant,
   block: INotionBlockModel
) {
   let iconComponent: JSX.Element | undefined;
   if (icon?.length === 1) {
      iconComponent = (
         <Typography display="inline" variant={variant}>
            {'' + icon + ' '}
         </Typography>
      );
   } else if (icon != null && /https:.*/.test(icon)) {
      const notionUrl =
         'https://www.notion.so/image/' +
         encodeURIComponent(icon) +
         `?table=block&id=${block.blockId}&width=${32}`;
      iconComponent = (
         <Typography display="inline" variant={variant}>
            <img
               style={{ maxHeight: '90%', marginBottom: -4 }}
               src={notionUrl}
               alt="📄"></img>
         </Typography>
      );
   } else {
      icon = '📄';
      if (
         block.type === BlockTypeEnum.CollectionViewPage ||
         block.type === BlockTypeEnum.CollectionViewInline
      ) {
         icon = '🗄️';
      }

      iconComponent = (
         <Typography display="inline" variant={variant}>
            {'' + icon + ' '}
         </Typography>
      );
   }
   return iconComponent;
}
