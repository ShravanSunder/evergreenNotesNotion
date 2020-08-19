import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Callout } from 'aNotion/types/notionV3/notionBlockTypes';
import { useBlockStyles } from './BlockUi';
export const CalloutUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();
   var callout = block.block as Callout;
   return (
      <Grid container style={{ padding: 6 }}>
         <Grid item style={{ paddingLeft: 9, paddingRight: 9 }}>
            <Typography variant={'body1'}>
               {block.block?.format?.page_icon}
            </Typography>
         </Grid>
         <Grid item xs={10}>
            <Typography variant={'body1'} className={classes.typography}>
               {block.simpleTitle}
            </Typography>
         </Grid>
      </Grid>
   );
};
