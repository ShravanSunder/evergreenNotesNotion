import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { useStyles } from './BlockUi';
export const NumberUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useStyles();
   return (
      <Grid container>
         <Grid item xs={1} style={{ paddingLeft: 9, paddingRight: 9 }}>
            <Typography display={'inline'} variant={'body1'}>
               {' #  '}
            </Typography>
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
