import React, { useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';

export const BulletUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let classes = blockStyles();
   const [hasSegments, setHasSegments] = useState(true);

   const textUIComponent = (
      <TextUi
         block={block}
         semanticFilter={semanticFilter}
         style={style}
         interactive={interactive}
         setHasSegments={setHasSegments}></TextUi>
   );

   if (!hasSegments) {
      return textUIComponent;
   }

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
            {textUIComponent}
         </Grid>
      </Grid>
   );
};
