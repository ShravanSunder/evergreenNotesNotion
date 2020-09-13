import React from 'react';
import { Typography, Icon } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Page } from 'aNotion/types/notionV3/notionBlockTypes';
import { TextUi } from './TextUi';
import { Variant } from '@material-ui/core/styles/createTypography';

export const PageUi = ({
   block,
   variant,
}: {
   block: NotionBlockModel;
   variant: Variant | undefined;
}) => {
   const page = block.block as Page;
   const icon = page.format?.page_icon;
   return (
      <React.Fragment>
         <Typography display="inline" variant={variant}>
            {' ' + icon + ' '}
         </Typography>
         <TextUi block={block} variant={variant}></TextUi>
      </React.Fragment>
   );
};
