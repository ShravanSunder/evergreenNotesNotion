import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { Callout } from 'aNotion/types/notionV3/notionBlockTypes';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';

export const CalloutUi = ({ block, interactive = true }: IBaseTextUiParams) => {
   let classes = blockStyles();
   var callout = block.block as Callout;

   return (
      <Grid id="CalloutUI" container style={{ padding: 9 }}>
         <Grid item style={{ paddingLeft: 9, paddingRight: 9 }}>
            <Typography variant={'body1'}>
               {block.block?.format?.page_icon}
            </Typography>
         </Grid>
         <Grid item xs={10}>
            <TextUi block={block} interactive={interactive}></TextUi>
         </Grid>
      </Grid>
   );
};
