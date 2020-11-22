import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useBlockStyles } from './useBlockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';

export const BulletUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let classes = useBlockStyles();
   return (
      <Grid
         id="BulletUI"
         container
         justify="flex-start"
         style={style}
         className={classes.blockUiGrids}>
         <Grid item className={classes.blockUiGrids}>
            <div className={classes.bulletsAndIndents}>
               <Typography display={'inline'} variant={'body1'}>
                  {' • '}
               </Typography>
            </div>
         </Grid>
         <Grid item xs className={classes.blockUiGrids}>
            <TextUi
               block={block}
               semanticFilter={semanticFilter}
               style={style}
               interactive={interactive}></TextUi>
         </Grid>
      </Grid>
   );
};
