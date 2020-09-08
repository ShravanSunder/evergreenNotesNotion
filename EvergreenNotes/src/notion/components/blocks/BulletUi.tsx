import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { useBlockStyles } from './BlockUi';
import { TextUi } from './TextUi';
export const BulletUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useBlockStyles();
   return (
      <Grid container alignItems="flex-start">
         <Grid
            item
            xs={1}
            style={{ paddingLeft: 12, paddingRight: 3, marginTop: 1 }}>
            <Typography display={'inline'} variant={'body1'}>
               {'  • '}
            </Typography>
         </Grid>
         <Grid item xs={11}>
            <TextUi block={block}></TextUi>
         </Grid>
      </Grid>
   );
};
