import React from 'react';
import { Typography } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Page } from 'aNotion/types/notionV3/notionBlockTypes';
import { useStyles } from './BlockUi';
export const PageUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useStyles();
   let page = block.block as Page;
   let icon = page.properties?.COXj?.[0]?.[0] ?? '';

   return (
      <React.Fragment>
         <Typography display={'inline'} variant={'subtitle1'}>
            {' 🔗 '}
         </Typography>
         <Typography
            display={'inline'}
            variant={'subtitle1'}
            className={classes.typography}>
            {block.simpleTitle}
         </Typography>
      </React.Fragment>
   );
};
