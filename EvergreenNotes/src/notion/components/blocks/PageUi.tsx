import React from 'react';
import { Typography, Icon } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { Page } from 'aNotion/types/notionV3/notionBlockTypes';
import { TextUi } from './TextUi';
import { Variant } from '@material-ui/core/styles/createTypography';
import { NotionContentWithParentId } from 'aNotion/components/contents/NotionContent';
import { MaximizeTwoTone } from '@material-ui/icons';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';

interface IPageUIParams {
   block: INotionBlockModel;
   style?: React.CSSProperties | undefined;
   inlineBlock?: boolean;
   showContent?: boolean | undefined;
   interactive?: boolean;
}

export const PageUi = ({
   block,
   style = undefined,
   inlineBlock = true,
   showContent = undefined,
   interactive = false,
}: IPageUIParams) => {
   const page = block.block as Page;
   let icon = page.format?.page_icon;
   let iconComponent: JSX.Element | undefined = undefined;
   const variant = inlineBlock ? 'body1' : 'h4';

   const renderChildren = inlineBlock ? false : showContent ?? false;

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

   return (
      <div id="PageUI" style={style}>
         {iconComponent}
         <TextUi
            block={block}
            variant={variant}
            interactive={interactive}
            style={style}></TextUi>
         {renderChildren && (
            <>
               <div style={{ marginTop: 12 }}></div>
               <NotionContentWithParentId
                  interactive={interactive}
                  parentBlockId={block.blockId}></NotionContentWithParentId>
            </>
         )}
      </div>
   );
};
