import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useBlockStyles } from './useBlockStyles';
import { BaseTextUiParameters, TextUi } from './TextUi';

export const BulletUi = ({
   block,
   semanticFilter,
   style,
}: BaseTextUiParameters) => {
   let classes = useBlockStyles();
   return (
      <Grid
         id="BulletUI"
         container
         justify="flex-start"
         style={style}
         className={classes.blockUiGrids}>
         <Grid item className={classes.blockUiGrids}>
            <div className={classes.bullets}>
               <Typography display={'inline'} variant={'body1'}>
                  {' • '}
               </Typography>
            </div>
         </Grid>
         <Grid item xs className={classes.blockUiGrids}>
            <TextUi
               block={block}
               semanticFilter={semanticFilter}
               style={style}></TextUi>
         </Grid>
      </Grid>
   );
};
