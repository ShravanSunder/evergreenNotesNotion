import React from 'react';
import { Typography, Divider, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { useBlockStyles } from './BlockUi';
export const QuoteUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();
   return (
      <Grid container>
         <Grid item style={{ paddingRight: 9 }}>
            <Divider
               orientation="vertical"
               style={{ backgroundColor: '#262626', width: 2 }}></Divider>
         </Grid>
         <Grid item xs={11}>
            <Typography
               display={'inline'}
               variant={'body1'}
               className={classes.typography}>
               {block.simpleTitle}
            </Typography>
         </Grid>
      </Grid>
   );
};
