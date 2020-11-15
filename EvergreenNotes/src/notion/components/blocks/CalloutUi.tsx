import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Callout } from 'aNotion/types/notionV3/notionBlockTypes';
import { useBlockStyles } from './useBlockStyles';
import { TextUi } from './TextUi';

export const CalloutUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();
   var callout = block.block as Callout;

   return (
      <Grid container style={{ margin: 6 }}>
         <Grid item style={{ paddingLeft: 9, paddingRight: 9 }}>
            <Typography variant={'body1'}>
               {block.block?.format?.page_icon}
            </Typography>
         </Grid>
         <Grid item xs={10}>
            <TextUi block={block}></TextUi>
         </Grid>
      </Grid>
   );
};
