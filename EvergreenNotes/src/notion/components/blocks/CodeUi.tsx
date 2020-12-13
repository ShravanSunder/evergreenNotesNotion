import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { blockStyles } from './blockStyles';

export const CodeUi = ({ block }: { block: INotionBlockModel }) => {
   let classes = blockStyles();
   return (
      <Grid id="CodeUI" container style={{ padding: 12 }}>
         <Grid item xs>
            <Typography
               variant={'body2'}
               className={classes.typography}
               style={{ fontFamily: 'Consolas' }}>
               {block.simpleTitle}
            </Typography>
         </Grid>
      </Grid>
   );
};
