import React from 'react';
import { Typography, Icon } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Page } from 'aNotion/types/notionV3/notionBlockTypes';
import { TextUi } from './TextUi';
import { Variant } from '@material-ui/core/styles/createTypography';
import { NotionContentWithParentId } from 'aNotion/components/contents/NotionContent';

interface IPageUIParams {
   block: NotionBlockModel;
   variant: Variant | undefined;
   style: React.CSSProperties | undefined;
   renderChildren: boolean;
}

export const PageUi = ({
   block,
   variant,
   style,
   renderChildren,
}: IPageUIParams) => {
   const page = block.block as Page;
   let icon = page.format?.page_icon;
   let iconComponent: JSX.Element | undefined = undefined;

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
            <img src={notionUrl} alt="📄"></img>
         </Typography>
      );
   } else {
      icon = '📄';
      iconComponent = (
         <Typography display="inline" variant={variant}>
            {'' + icon + ' '}
         </Typography>
      );
   }

   return (
      <div id="PageUI" style={style}>
         {iconComponent}
         <TextUi block={block} variant={variant} style={style}></TextUi>
         {renderChildren && (
            <>
               <div style={{ marginTop: 6 }}></div>
               <NotionContentWithParentId
                  parentBlockId={block.blockId}></NotionContentWithParentId>
            </>
         )}
      </div>
   );
};
